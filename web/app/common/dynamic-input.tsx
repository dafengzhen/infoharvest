export interface IDynamicInput {
  id: string | number;
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  _dynamic?: boolean;
}

export default function DynamicInput({
  title = 'Subset',
  label = 'Support creating multiple subsets',
  items = [],
  onDel = () => {},
  onAdd = () => {},
  onChangeInput = () => {},
}: {
  title: string;
  label: string;
  items: IDynamicInput[];
  onDel: (item: IDynamicInput) => void;
  onAdd: () => void;
  onChangeInput: (
    item: IDynamicInput,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  return (
    <div className="form-control my-3">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <label className="label mb-1">
        <span className="label-text-alt">{label}</span>
      </label>
      <div className="flex flex-col space-y-2">
        {items.map((item) => {
          return (
            <div className="flex space-x-2" key={item.id}>
              <input
                autoFocus={item.autoFocus}
                type="text"
                placeholder={item.placeholder ?? ''}
                className="input grow input-bordered"
                value={item.value}
                name="value"
                onChange={(event) => onChangeInput(item, event)}
              />
              <button
                type="button"
                onClick={() => onDel(item)}
                className="btn btn-ghost normal-case"
              >
                <i className="bi bi-dash-lg"></i>
                <span>Del</span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="my-3">
        <div className="card-actions">
          <button
            type="button"
            onClick={onAdd}
            className="btn btn-sm normal-case"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
