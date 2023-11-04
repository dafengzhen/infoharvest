import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from 'react';
import { nanoid } from 'nanoid';

interface IValue {
  id: string;
  value: string;
}

export default function SimpleDynamicInput({
  title = 'Names',
  label = 'Please enter a name, it can be multiple, but cannot be empty',
  items = [],
  setItems = () => {},
}: {
  title: string;
  label: string;
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
}) {
  const [values, setValues] = useState<IValue[]>(
    items.map((item) => ({ id: nanoid(), value: item })),
  );

  useEffect(() => {
    setItems(values.map((item) => item.value));
  }, [values]);

  function onClickAdd() {
    setValues([...values, { id: nanoid(), value: '' }]);
  }

  function onClickDelete(item: IValue) {
    setValues(values.filter((value) => value.id !== item.id));
  }

  function onClickPop() {
    values.pop();
    setValues([...values]);
  }

  function onChange(item: IValue, e: ChangeEvent<HTMLInputElement>) {
    const find = values.find((value) => value.id === item.id);
    if (find) {
      find.value = e.target.value;
      setValues([...values]);
    }
  }

  return (
    <div className="form-control my-3">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <label className="label mb-1">
        <span className="label-text-alt">{label}</span>
      </label>
      <div className="flex flex-col space-y-2">
        {values.map((item) => {
          return (
            <div className="flex space-x-2" key={item.id}>
              <input
                autoFocus={!item.value}
                type="text"
                className="input grow input-bordered"
                value={item.value}
                name="value"
                onChange={(event) => onChange(item, event)}
              />
              <button
                type="button"
                onClick={() => onClickDelete(item)}
                className="btn btn-ghost normal-case"
              >
                <i className="bi bi-dash-lg"></i>
                <span>Del</span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-2 my-3">
        <div className="card-actions">
          <button
            type="button"
            onClick={onClickAdd}
            className="btn btn-sm normal-case"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add</span>
          </button>
        </div>
        {values.length > 0 && (
          <div className="card-actions">
            <button
              type="button"
              onClick={onClickPop}
              className="btn btn-sm normal-case"
            >
              <i className="bi bi-dash-lg"></i>
              <span>Del</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
