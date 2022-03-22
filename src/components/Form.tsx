import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { StringMappingType } from 'typescript';

type listFormProps = {
  btnTitle?: StringMappingType;
  onSave: any;
};

export const AddNewListForm = (props: listFormProps) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const ref = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeForm();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const closeForm = () => {
    setShowForm(false);
    setTitle('');
  };

  const addGroup = () => {
    props.onSave(title);
    closeForm();
  };

  return (
    <div className="w-[17rem] min-w-[17rem] rounded overflow-hidden">
      <div
        ref={ref}
        className={clsx(
          'w-full p-1 rounded overflow-hidden',
          showForm
            ? 'bg-gray-200'
            : 'bg-black bg-opacity-50 hover:bg-opacity-25'
        )}
      >
        {showForm ? (
          <div>
            <input
              type="text"
              className="bg-white h-8 w-full border-2 border-blue-600 rounded px-2"
              placeholder="Enter list title..."
              value={title}
              onChange={inputHandler}
              onKeyDown={(e) => {
                (e.code === 'NumpadEnter' || e.code === 'Enter') && addGroup();
              }}
              autoFocus
            />
            <div className="mt-1">
              <button
                className="bg-blue-500 px-5 py-1 rounded text-white"
                onClick={addGroup}
              >
                Add list
              </button>
              <button className="ml-1 p-1" onClick={closeForm}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        ) : (
          <button
            className="h-8 w-full text-left px-3 text-white"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-lg mr-2"></i>
            {props.btnTitle || 'Add a list'}
          </button>
        )}
      </div>
    </div>
  );
};

type ListItemFormProps = {
  className?: string;
  groupI: number;
  onSave: any;
};

export const AddNewListItemForm = (props: ListItemFormProps) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState('');

  const ref = useRef<any>(null);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeForm();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setTitle('');
  };

  const inputHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const addCard = () => {
    if (title.trim().length) {
      props.onSave(title.trim(), props.groupI);
      try {
        inputRef.current.focus();
        setTimeout(() => {
          setTitle('');
        }, 10);
      } catch (error) {}
    }
  };

  return (
    <div
      className={clsx('w-full rounded overflow-hidden', props.className)}
      ref={ref}
    >
      <div
        className={clsx(
          'w-full',
          showForm
            ? ''
            : 'bg-black bg-opacity-0 hover:bg-opacity-5 duration-300'
        )}
      >
        {showForm ? (
          <div>
            <textarea
              ref={inputRef}
              autoFocus
              name=""
              id=""
              rows={3}
              className="bg-white w-full rounded px-2 shadow outline-none"
              placeholder="Enter a title for this card"
              value={title}
              onChange={inputHandler}
              onKeyDown={(e) => {
                (e.code === 'NumpadEnter' || e.code === 'Enter') && addCard();
              }}
            ></textarea>
            <div className="mt-1">
              <button
                className="bg-blue-500 px-5 py-1 rounded text-white"
                onClick={addCard}
              >
                Add card
              </button>
              <button className="ml-1 p-1" onClick={closeForm}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        ) : (
          <button
            className="h-9 w-full text-left px-3 text-black"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus-lg mr-2"></i>
            Add a card
          </button>
        )}
      </div>
    </div>
  );
};
