create table if not exists user
(
    id                     int auto_increment
        primary key,
    create_date            datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date            datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date            datetime(6)                              null,
    version                int                                      not null,
    username               varchar(255)                             not null,
    password               varchar(255)                             not null,
    avatar                 varchar(255)                             null,
    example                tinyint     default 0                    not null,
    customization_settings json                                     not null,
    constraint IDX_78a916df40e02a9deb1c4b75ed
        unique (username)
);

create table if not exists collection
(
    id               int auto_increment
        primary key,
    create_date      datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date      datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date      datetime(6)                              null,
    version          int                                      not null,
    name             varchar(255)                             not null,
    sort             int         default 0                    not null,
    parent_subset_id int                                      null,
    user_id          int                                      null,
    constraint FK_4f925485b013b52e32f43d430f6
        foreign key (user_id) references user (id)
            on delete cascade,
    constraint FK_bae24ecb91234cc53d931acca3b
        foreign key (parent_subset_id) references collection (id)
            on delete cascade
);

create fulltext index IDX_926e7bdc3f52cd582078a379f1
    on collection (name) with parser ngram;

create table if not exists excerpt
(
    id                     int auto_increment
        primary key,
    create_date            datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date            datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date            datetime(6)                              null,
    version                int                                      not null,
    icon                   text                                     null,
    description            text                                     null,
    sort                   int         default 0                    not null,
    enable_history_logging tinyint     default 0                    not null,
    user_id                int                                      null,
    collection_id          int                                      null,
    constraint FK_7bc2557baf1af9a24978c79c552
        foreign key (user_id) references user (id)
            on delete cascade,
    constraint FK_894c4acac070863783d48b46201
        foreign key (collection_id) references collection (id)
            on delete cascade
);

create fulltext index IDX_c949cdba56b2ded0ff00882d3d
    on excerpt (description) with parser ngram;

create table if not exists excerpt_link
(
    id          int auto_increment
        primary key,
    create_date datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date datetime(6)                              null,
    version     int                                      not null,
    link        text                                     null,
    excerpt_id  int                                      null,
    constraint FK_108075acb69d8351575a0fea05c
        foreign key (excerpt_id) references excerpt (id)
            on delete cascade
);

create fulltext index IDX_8c73b2f78f90416e5bbc0878ba
    on excerpt_link (link) with parser ngram;

create table if not exists excerpt_name
(
    id          int auto_increment
        primary key,
    create_date datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date datetime(6)                              null,
    version     int                                      not null,
    name        varchar(255)                             not null,
    excerpt_id  int                                      null,
    constraint FK_6c9d212d39f76c76c1c815fcea9
        foreign key (excerpt_id) references excerpt (id)
            on delete cascade
);

create fulltext index IDX_6e116fc06c2022b662234895a1
    on excerpt_name (name) with parser ngram;

create table if not exists excerpt_state
(
    id          int auto_increment
        primary key,
    create_date datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date datetime(6)                              null,
    version     int                                      not null,
    state       varchar(255)                             not null,
    excerpt_id  int                                      null,
    constraint FK_9fc4d7a39435ab2b05845e5b3e4
        foreign key (excerpt_id) references excerpt (id)
            on delete cascade
);

create fulltext index IDX_9fdc26557d84c402fba6d21103
    on excerpt_state (state) with parser ngram;

create table if not exists history
(
    id                     int auto_increment
        primary key,
    create_date            datetime(6) default CURRENT_TIMESTAMP(6) not null,
    update_date            datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    delete_date            datetime(6)                              null,
    version                int                                      not null,
    icon                   text                                     null,
    description            text                                     null,
    sort                   int         default 0                    not null,
    enable_history_logging tinyint     default 0                    not null,
    h_names                json                                     not null,
    h_links                json                                     not null,
    h_states               json                                     not null,
    user_id                int                                      null,
    collection_id          int                                      null,
    excerpt_id             int                                      null,
    constraint FK_9dedd12f016de91942098b6504c
        foreign key (excerpt_id) references excerpt (id),
    constraint FK_ea92daa642af67e2a924a5547d5
        foreign key (user_id) references user (id)
            on delete cascade,
    constraint FK_ff4c964ae802a459b52e47e5ac1
        foreign key (collection_id) references collection (id)
            on delete cascade
);

create fulltext index IDX_4d86d1a9f4d58c624a108b534b
    on history (description) with parser ngram;
