import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { TokenVo } from './vo/token.vo';
import { Collection } from '../collection/entities/collection.entity';
import { Excerpt } from '../excerpt/entities/excerpt.entity';
import { History } from '../history/entities/history.entity';
import { ExcerptLink } from '../excerpt/entities/excerpt-link.entity';
import { ExcerptName } from '../excerpt/entities/excerpt-name.entity';
import { ExcerptState } from '../excerpt/entities/excerpt-state.entity';

/**
 * UserService,
 *
 * @author dafengzhen
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(Excerpt)
    private readonly excerptRepository: Repository<Excerpt>,

    @InjectRepository(ExcerptName)
    private readonly excerptNameRepository: Repository<ExcerptName>,

    @InjectRepository(ExcerptLink)
    private readonly excerptLinkRepository: Repository<ExcerptLink>,

    @InjectRepository(ExcerptState)
    private readonly excerptStateRepository: Repository<ExcerptState>,

    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,

    private readonly authService: AuthService,

    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const username = createUserDto.username;
    const password = createUserDto.password;

    if (
      await this.userRepository.exist({
        where: { username },
      })
    ) {
      // 用户已经存在，创建失败
      throw new BadRequestException('The user already exists, creation failed');
    }

    const user = await this.userRepository.save(
      new User({
        username,
        password: await this.authService.encryptPassword(password),
      }),
    );

    return new TokenVo({
      id: user.id,
      username: user.username,
      token: await this.authService.getTokenForUser(user),
    });
  }

  async createExampleUser() {
    const username = 'root';
    const password = '123456';

    if (
      await this.userRepository.exist({
        where: {
          username,
        },
      })
    ) {
      // 示例用户已存在数据库中，无法被再次创建
      throw new BadRequestException(
        'The example user already exists in the database and cannot be created again',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedUser = await this.userRepository.save(
        new User({
          username,
          password: await this.authService.encryptPassword(password),
          example: true,
        }),
      );

      const data = this.getExampleData();
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const collection = new Collection({ name: item.name });
        collection.user = savedUser;
        collection.subset = item.subset.map((value) => {
          const _subset = new Collection({ name: value.name });
          _subset.user = savedUser;
          _subset.excerpts = value.excerpts.map((excerpt) => {
            const _excerpt = new Excerpt();
            _excerpt.user = savedUser;
            _excerpt.names = excerpt.names.map(
              (_name) => new ExcerptName({ name: _name }),
            );
            _excerpt.links = excerpt.links.map(
              (_link) => new ExcerptLink({ link: _link }),
            );
            _excerpt.description = excerpt.description;
            return _excerpt;
          });
          return _subset;
        });
        await this.collectionRepository.save(collection);
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return {
      username,
      password,
      example: true,
    };
  }

  async getUsersCountByDate() {
    return this.userRepository
      .createQueryBuilder()
      .select('DATE(create_date)', 'date')
      .addSelect('COUNT(id)', 'count')
      .groupBy('DATE(create_date)')
      .getRawMany();
  }

  async findOne(id: number, user: User) {
    this.checkIfUserIsOwner(id, user);
    return this.userRepository.findOneBy({
      id,
    });
  }

  async update(id: number, currentUser: User, updateUserDto: UpdateUserDto) {
    this.checkIfUserIsOwner(id, currentUser);
    const user = await this.userRepository.findOneBy({
      id,
    });

    const username = updateUserDto.username;
    if (username) {
      if (
        await this.userRepository.exist({
          where: { username },
        })
      ) {
        // 用户名称已经存在，请考虑重新命名
        throw new BadRequestException(
          'Username already exists, please consider choosing a different name',
        );
      }

      user.username = username;
    }

    const oldPassword = updateUserDto.oldPassword;
    const newPassword = updateUserDto.newPassword;
    if (oldPassword && !newPassword) {
      // 新密码不能为空
      throw new BadRequestException('The new password cannot be empty');
    } else if (newPassword && !oldPassword) {
      // 要更新新密码，必须输入旧密码
      throw new BadRequestException(
        'To update the new password, you must enter the old password',
      );
    } else if (newPassword && oldPassword) {
      if (
        !(await this.authService.isMatchPassword(oldPassword, user.password))
      ) {
        // 抱歉，旧密码验证错误
        throw new BadRequestException(
          'Sorry, the old password verification failed',
        );
      }

      user.password = await this.authService.encryptPassword(newPassword);
    }

    const avatar = updateUserDto.avatar;
    if (typeof avatar === 'string') {
      user.avatar = avatar;
    }

    await this.userRepository.save(user);
  }

  async remove(currentUser: User) {
    if (currentUser.example) {
      // 抱歉，无法注销示例用户
      throw new BadRequestException(
        "I'm sorry, but I cannot log out the example user",
      );
    }

    const id = currentUser.id;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: {
          collections: {
            subset: true,
          },
          excerpts: {
            names: true,
            links: true,
            states: true,
          },
          histories: true,
        },
      });

      // histories
      await this.historyRepository.remove(user.histories);

      // excerpts
      const excerpts = user.excerpts;
      for (let i = 0; i < excerpts.length; i++) {
        const excerpt = excerpts[i];
        await this.excerptNameRepository.remove(excerpt.names);
        await this.excerptLinkRepository.remove(excerpt.links);
        await this.excerptStateRepository.remove(excerpt.states);
      }
      await this.excerptRepository.remove(excerpts);

      // collections
      const collections = user.collections;
      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        await this.collectionRepository.remove(collection.subset);
      }
      await this.collectionRepository.remove(collections);

      // user
      await this.userRepository.remove(user);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  private checkIfUserIsOwner(id: number, user: User) {
    if (id !== user.id) {
      // 抱歉，非用户本人，无权限操作该用户资源
      throw new ForbiddenException(
        "Apologies, not the user themselves, lacking permission to access the user's resources",
      );
    }
  }

  private getExampleData() {
    return [
      {
        name: '电影',
        subset: [
          {
            name: '剧情',
            excerpts: [
              {
                names: ['八角笼中'],
                links: ['https://www.example.com'],
                description: '王宝强冲破命运牢笼',
              },
              {
                names: ['疯狂元素城'],
                links: ['https://www.example.com'],
                description: '开启缤纷元素城奇妙冒险！',
              },
              {
                names: ['扫毒 3：人在天涯'],
                links: ['https://www.example.com'],
                description: '古天乐刘青云郭富城抢毒！',
              },
              {
                names: ['无名'],
                links: ['https://www.example.com'],
                description: '梁朝伟王一博生死谍战！',
              },
              {
                names: ['满江红'],
                links: ['https://www.example.com'],
                description: '沈腾千玺演绎热血忠义！',
              },
              {
                names: ['赌神'],
                links: ['https://www.example.com'],
                description: '发哥情迷女生之作！',
              },
              {
                names: ['长空之王'],
                links: ['https://www.example.com'],
                description: '王一博胡军周冬雨戎装亮相！',
              },
              {
                names: ['你的名字'],
                links: ['https://www.example.com'],
                description: '新海诚口碑票房双爆神作！',
              },
            ],
          },
          {
            name: '喜剧',
            excerpts: [
              {
                names: ['超能一家人'],
                links: ['https://www.example.com'],
                description: '艾伦沈腾爆笑重聚',
              },
              {
                names: ['赌侠'],
                links: ['https://www.example.com'],
                description: '华仔星爷联手驰骋赌博界！',
              },
              {
                names: ['前任 3：再见前任'],
                links: ['https://www.example.com'],
                description: '韩庚郑恺“双贱合璧”',
              },
              {
                names: ['功夫'],
                links: ['https://www.example.com'],
                description: '帅气！星爷大战斧头帮',
              },
              {
                names: ['九品芝麻官'],
                links: ['https://www.example.com'],
                description: '周星驰大展骂功斗恶霸',
              },
              {
                names: ['唐伯虎点秋香'],
                links: ['https://www.example.com'],
                description: '经典才子佳人爱情故事',
              },
              {
                names: ['西虹市首富'],
                links: ['https://www.example.com'],
                description: '沈腾搞怪笑skr人',
              },
              {
                names: ['交换人生'],
                links: ['https://www.example.com'],
                description: '雷佳音张小斐变欢喜冤家',
              },
            ],
          },
          {
            name: '动作',
            excerpts: [
              {
                names: ['封神第一部：朝歌风云'],
                links: ['https://www.example.com'],
                description: '乌尔善再导魔幻巨制',
              },
              {
                names: ['巨齿鲨2：深渊'],
                links: ['https://www.example.com'],
                description: '斯坦森吴京双雄联手战巨鲨',
              },
              {
                names: ['阿凡达'],
                links: ['https://www.example.com'],
                description: '卡神巨制！影史票房第一',
              },
              {
                names: ['变形金刚：超能勇士崛起'],
                links: ['https://www.example.com'],
                description: '猛兽侠、擎天柱强强对决',
              },
              {
                names: ['碟中谍 7：致命清算（上）'],
                links: ['https://www.example.com'],
                description: '阿汤哥飞车跳崖千米伞降',
              },
              {
                names: ['速度与激情 10'],
                links: ['https://www.example.com'],
                description: '速激系列终章燃炸肾上腺',
              },
              {
                names: ['红海行动'],
                links: ['https://www.example.com'],
                description: '特种部队鏖战海陆空',
              },
              {
                names: ['战狼 2'],
                links: ['https://www.example.com'],
                description: '最燃国产军事片再出续集',
              },
            ],
          },
        ],
      },
      {
        name: '电视剧',
        subset: [
          {
            name: '爱情',
            excerpts: [
              {
                names: ['长相思 第一季'],
                links: ['https://www.example.com'],
                description: '杨紫极致虐恋修罗场',
              },
              {
                names: ['陈情令'],
                links: ['https://www.example.com'],
                description: '肖战王一博共闯侠义江湖',
              },
              {
                names: ['且试天下'],
                links: ['https://www.example.com'],
                description: '杨洋赵露思并肩共赴天下',
              },
              {
                names: ['爱情公寓 3'],
                links: ['https://www.example.com'],
                description: '合租男女囧事多',
              },
              {
                names: ['香蜜沉沉烬如霜'],
                links: ['https://www.example.com'],
                description: '杨紫开启四界追爱之旅',
              },
              {
                names: ['梦华录'],
                links: ['https://www.example.com'],
                description: '刘亦菲陈晓共闯大宋繁华',
              },
              {
                names: ['大唐荣耀'],
                links: ['https://www.example.com'],
                description: '景甜任嘉伦演绎乱世爱恋',
              },
              {
                names: ['长歌行'],
                links: ['https://www.example.com'],
                description: '热巴吴磊热血共守家国梦',
              },
            ],
          },
          {
            name: '古装',
            excerpts: [
              {
                names: ['繁城之下'],
                links: ['https://www.example.com'],
                description: '白宇帆宁理破诡案揭人性',
              },
              {
                names: ['雪中悍刀行'],
                links: ['https://www.example.com'],
                description: '张若昀搅动庙堂江湖',
              },
              {
                names: ['庆余年'],
                links: ['https://www.example.com'],
                description: '张若昀身陷棋局绝处逢生',
              },
              {
                names: ['知否知否应是绿肥红瘦'],
                links: ['https://www.example.com'],
                description: '赵丽颖冯绍峰琴瑟和鸣',
              },
              {
                names: ['芈月传'],
                links: ['https://www.example.com'],
                description: '孙俪演绎第一女政治家',
              },
              {
                names: ['新三国'],
                links: ['https://www.example.com'],
                description: '陈建斌倪大红陆毅乱世争霸',
              },
              {
                names: ['鹊刀门传奇'],
                links: ['https://www.example.com'],
                description: '赵本山宋小宝再联手',
              },
              {
                names: ['琅琊榜'],
                links: ['https://www.example.com'],
                description: '胡歌刘涛演绎惊魂权谋',
              },
            ],
          },
          {
            name: '悬疑',
            excerpts: [
              {
                names: ['反诈风暴'],
                links: ['https://www.example.com'],
                description: '警察师徒携手正义反诈',
              },
              {
                names: ['猎毒人'],
                links: ['https://www.example.com'],
                description: '于和伟徐峥缉毒天团',
              },
              {
                names: ['扫黑风暴'],
                links: ['https://www.example.com'],
                description: '孙红雷张艺兴惩黑除恶',
              },
              {
                names: ['神探狄仁杰'],
                links: ['https://www.example.com'],
                description: '元芳你怎么看',
              },
              {
                names: ['不说再见'],
                links: ['https://www.example.com'],
                description: '任嘉伦张钧甯烧脑试探',
              },
              {
                names: ['暗黑者 2'],
                links: ['https://www.example.com'],
                description: '专案组与神秘暗黑者博弈',
              },
              {
                names: ['无心法师 3'],
                links: ['https://www.example.com'],
                description: '韩东君陈瑶续写无心前传',
              },
              {
                names: ['使徒行者 3'],
                links: ['https://www.example.com'],
                description: '林峯回归再陷卧底疑云',
              },
            ],
          },
        ],
      },
      {
        name: '动漫',
        subset: [
          {
            name: '冒险',
            excerpts: [
              {
                names: ['斗罗大陆'],
                links: ['https://www.example.com'],
                description: '斗罗五年，璀璨终章！',
              },
              {
                names: ['吞噬星空'],
                links: ['https://www.example.com'],
                description: '银河浩瀚，征途不止',
              },
              {
                names: ['万界神主'],
                links: ['https://www.example.com'],
                description: '陨落古神，遨游苍蓝',
              },
              {
                names: ['斗破苍穹 第 4 季'],
                links: ['https://www.example.com'],
                description: '少年不屈 异火不熄',
              },
              {
                names: ['一人之下 第 2 季'],
                links: ['https://www.example.com'],
                description: '一人之下 第2季',
              },
              {
                names: ['画江湖之不良人 第 4 季'],
                links: ['https://www.example.com'],
                description: '完结！去做你要做的事吧',
              },
              {
                names: ['星辰变 第 4 季'],
                links: ['https://www.example.com'],
                description: '会兄弟之情，夺逆央至宝',
              },
              {
                names: ['天行九歌 第 1 季'],
                links: ['https://www.example.com'],
                description: '超高颜值的权谋史诗',
              },
            ],
          },
          {
            name: '战斗',
            excerpts: [
              {
                names: ['完美世界'],
                links: ['https://www.example.com'],
                description: '谁来续至尊和传说？',
              },
              {
                names: ['神印王座'],
                links: ['https://www.example.com'],
                description: '深渊再起，王座降临',
              },
              {
                names: ['万界独尊'],
                links: ['https://www.example.com'],
                description: '我身为剑，再续前缘',
              },
              {
                names: ['妖神记'],
                links: ['https://www.example.com'],
                description: '重生踏足武道巅峰',
              },
              {
                names: ['万界仙踪'],
                links: ['https://www.example.com'],
                description: '斩断仙缘，融化思念',
              },
              {
                names: ['魔道祖师'],
                links: ['https://www.example.com'],
                description: '夷陵老祖重现人间',
              },
              {
                names: ['武庚纪 第 4 季'],
                links: ['https://www.example.com'],
                description: '神力觉醒 封神演义',
              },
              {
                names: ['全职高手'],
                links: ['https://www.example.com'],
                description: '荣耀不灭，兴欣归来',
              },
            ],
          },
          {
            name: '经典',
            excerpts: [
              {
                names: ['名侦探柯南'],
                links: ['https://www.example.com'],
                description: '永恒的柯南',
              },
              {
                names: ['蜡笔小新'],
                links: ['https://www.example.com'],
                description: '最爆笑的小男孩儿',
              },
              {
                names: ['精灵宝可梦'],
                links: ['https://www.example.com'],
                description: '神奇宝贝无印篇',
              },
              {
                names: ['樱桃小丸子'],
                links: ['https://www.example.com'],
                description: '小丸子美好童真',
              },
              {
                names: ['网球王子'],
                links: ['https://www.example.com'],
                description: '天才网球少年',
              },
              {
                names: ['葫芦兄弟'],
                links: ['https://www.example.com'],
                description: '葫芦娃斗妖精',
              },
              {
                names: ['三国演义'],
                links: ['https://www.example.com'],
                description: '数风流人物，还看今朝！',
              },
              {
                names: ['哆啦A梦'],
                links: ['https://www.example.com'],
                description: '机器猫第 3 季',
              },
            ],
          },
        ],
      },
    ];
  }
}
