import clsx from 'clsx';
import { useState, useRef } from 'react';
import { arrayMoveImmutable } from 'array-move';
import toast from 'react-hot-toast';

import { AddNewListItemForm, AddNewListForm } from './../components/Form';

//IMPORT DUMMY DATA
import dummyData from './../data/dummyData';

function BoardPage() {
  const [data, setData] = useState(dummyData);
  const [dragEnable, setDragEnable] = useState(false);
  const [groupDragging, setGroupDragging] = useState<boolean>(false);
  const [cardDragging, setCardDragging] = useState<boolean>(false);
  const [groupEditTarget, setGroupEditTarget] = useState<{
    groupI: number;
    value: string;
  } | null>(null);
  const [cardEditTarget, setCardEditTarget] = useState<{
    groupI: number;
    cardI: number;
    value: string;
  } | null>(null);
  const dragGroupItem = useRef<any>(null);
  const dragGroupItemNode = useRef<any>(null);
  const dragCardItem = useRef<any>(null);
  const dragCardItemNode = useRef<any>(null);

  const handleGroupDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: { groupI: number }
  ) => {
    dragGroupItemNode.current = e.target;
    dragGroupItemNode.current.addEventListener('dragend', handleGroupDragEnd);
    dragGroupItem.current = item;

    setTimeout(() => {
      setGroupDragging(true);
    }, 0);
  };

  const handleGroupDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: { groupI: number }
  ) => {
    if (dragGroupItemNode.current !== e.target) {
      let newList = arrayMoveImmutable(
        data,
        dragGroupItem.current.groupI,
        targetItem.groupI
      );
      dragGroupItem.current = targetItem;
      setData(newList);
    }
  };

  const handleGroupDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    dragGroupItemNode.current.removeAttribute('draggable');
    setGroupDragging(false);
    setDragEnable(false);
    dragGroupItem.current = null;
    dragGroupItemNode.current.removeEventListener(
      'dragend',
      handleGroupDragEnd
    );
    dragGroupItemNode.current = undefined;
  };

  const handleGroupGraggable = (e: any, draggable: boolean) => {
    if (draggable) {
      e.target.parentNode.parentNode.setAttribute('draggable', 'true');
      setDragEnable(true);
    } else {
      e.target.parentNode.parentNode.removeAttribute('draggable');
      setDragEnable(false);
    }
  };

  const handleCardDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    item: { groupI: number; cardI: number }
  ) => {
    dragCardItemNode.current = e.target;
    dragCardItemNode.current.addEventListener('dragend', handleCardDragEnd);
    dragCardItem.current = item;

    setTimeout(() => {
      setCardDragging(true);
    }, 0);
  };

  const handleCardDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetItem: { groupI: number; cardI: number }
  ) => {
    if (
      !(
        dragCardItem.current?.groupI === targetItem.groupI &&
        dragCardItem.current?.cardI === targetItem.cardI
      )
    ) {
      let newData = JSON.parse(JSON.stringify(data));
      if (dragCardItem.current?.groupI === targetItem.groupI) {
        newData[targetItem.groupI].items = arrayMoveImmutable(
          newData[targetItem.groupI].items,
          dragCardItem.current?.cardI,
          targetItem.cardI
        );

        dragCardItem.current = targetItem;
        setData(newData);
      } else {
        try {
          newData[targetItem.groupI].items = [
            ...newData[targetItem.groupI].items,
            newData[dragCardItem.current.groupI].items[
              dragCardItem.current.cardI
            ],
          ];
          newData[dragCardItem.current.groupI].items = newData[
            dragCardItem.current.groupI
          ].items.filter(
            (_: any, i: number) => i !== dragCardItem.current.cardI
          );
          newData[targetItem.groupI].items = arrayMoveImmutable(
            newData[targetItem.groupI].items,
            -1,
            targetItem.cardI
          );

          dragCardItem.current = targetItem;
          setData(newData);
        } catch (error: any) {}
      }
    }
  };

  const handleCardDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    dragCardItem.current = null;
    setCardDragging(false);

    dragCardItemNode.current.removeEventListener('dragend', handleCardDragEnd);
    dragCardItemNode.current = null;
  };

  const handleCardLock = (
    targetItem: { groupI: number; cardI: number },
    lock: boolean
  ) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData[targetItem.groupI].items[targetItem.cardI].lock = lock;
    setData(newData);
  };

  const handleGroupTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (groupEditTarget) {
      setGroupEditTarget({
        ...groupEditTarget,
        value: e.target.value,
      });
    }
  };

  const updateGroupTitle = () => {
    if (groupEditTarget) {
      const newData = JSON.parse(JSON.stringify(data));
      newData[groupEditTarget.groupI].title = groupEditTarget.value;
      setData(newData);
      setGroupEditTarget(null);
    }
  };

  const handleCardTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (cardEditTarget) {
      setCardEditTarget({
        ...cardEditTarget,
        value: e.target.value,
      });
    }
  };
  const updateCardTitle = () => {
    if (cardEditTarget) {
      let newData = JSON.parse(JSON.stringify(data));
      newData[cardEditTarget.groupI].items[cardEditTarget.cardI].title =
        cardEditTarget.value;
      setData(newData);
      setCardEditTarget(null);
    }
  };

  const onSaveNewCard = (title: string, groupI: number) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData[groupI].items = [
      ...newData[groupI].items,
      { title: title, lock: false },
    ];
    setData(newData);
  };

  const onSaveNewGroup = (title: string) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData = [
      ...newData,
      {
        title,
        items: [],
      },
    ];
    setData(newData);
  };

  const deleteGroup = (groupI: number) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData = newData.filter((_: any, i: number) => i !== groupI);
    setData(newData);
  };

  const deleteCard = (targetItem: { groupI: number; cardI: number }) => {
    let newData = JSON.parse(JSON.stringify(data));
    newData[targetItem.groupI].items = newData[targetItem.groupI].items.filter(
      (_: any, i: number) => i !== targetItem.cardI
    );
    setData(newData);
  };

  const showLockCardErrorMsg = () => {
    toast.error('This card is locked!');
  };

  return (
    <>
      <div
        className="main-board h-screen w-screen flex gap-2 p-1 overflow-auto"
        onDragOver={(e) => e.preventDefault()}
      >
        {data &&
          data.map((group, groupI) => (
            <div
              key={
                group.title.toLocaleLowerCase().replaceAll(' ', '-') + groupI
              }
              className={clsx('w-[17rem] min-w-[17rem] h-full')}
              onDragEnter={
                cardDragging
                  ? !group.items || !group.items.length
                    ? (e) =>
                        handleCardDragEnter(e, {
                          groupI,
                          cardI: 0,
                        })
                    : undefined
                  : (e) => handleGroupDragEnter(e, { groupI })
              }
            >
              <div
                className={clsx(
                  groupDragging && groupI === dragGroupItem.current?.groupI
                    ? 'bg-slate-500 duration-300'
                    : 'bg-slate-200',
                  'rounded'
                )}
                onDragStart={
                  dragEnable
                    ? (e) =>
                        handleGroupDragStart(e, {
                          groupI,
                        })
                    : undefined
                }
              >
                <div
                  className={clsx(
                    groupDragging &&
                      groupI === dragGroupItem.current?.groupI &&
                      'opacity-0'
                  )}
                >
                  <div className="flex items-center group">
                    <input
                      type="text"
                      className={clsx(
                        'py-1 px-2 select-none w-full bg-opacity-0 bg-white outline-none grow',
                        groupEditTarget?.groupI === groupI
                          ? 'border-2 rounded border-emerald-600 mb-1'
                          : 'cursor-pointer'
                      )}
                      value={
                        groupEditTarget && groupEditTarget.groupI === groupI
                          ? groupEditTarget.value
                          : group.title
                      }
                      readOnly={groupEditTarget?.groupI !== groupI}
                      onDoubleClick={() =>
                        setGroupEditTarget({
                          groupI,
                          value: group.title,
                        })
                      }
                      onMouseDown={(e) => handleGroupGraggable(e, true)}
                      onMouseUp={(e) => handleGroupGraggable(e, false)}
                      onBlur={updateGroupTitle}
                      onChange={handleGroupTitleInput}
                      onKeyDown={(e) => {
                        (e.code === 'NumpadEnter' || e.code === 'Enter') &&
                          updateGroupTitle();
                      }}
                    />
                    <button
                      className="duration-300 mr-1 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteGroup(groupI)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {group.items && group.items.length
                      ? group.items.map(
                          (card, cardI) => (
                            // card
                            <div
                              key={`gcard-${card.title
                                .toLocaleLowerCase()
                                .replaceAll(' ', '-')}-${groupI}-${cardI}`}
                              className={clsx(
                                'p-1 mx-1 rounded relative group',

                                cardDragging &&
                                  dragCardItem.current?.groupI === groupI &&
                                  dragCardItem.current?.cardI === cardI
                                  ? 'bg-gray-400'
                                  : 'bg-white'
                              )}
                              draggable={!card.lock}
                              onDragStart={(e) =>
                                handleCardDragStart(e, {
                                  groupI,
                                  cardI,
                                })
                              }
                              onDragEnter={(e) =>
                                handleCardDragEnter(e, {
                                  groupI,
                                  cardI,
                                })
                              }
                            >
                              <div
                                className={clsx(
                                  cardDragging &&
                                    dragCardItem.current?.groupI === groupI &&
                                    dragCardItem.current?.cardI === cardI &&
                                    'opacity-0'
                                )}
                              >
                                {cardEditTarget &&
                                cardEditTarget.groupI === groupI &&
                                cardEditTarget.cardI === cardI ? (
                                  <input
                                    type="text"
                                    placeholder="Input here"
                                    className="w-full p-1"
                                    value={cardEditTarget?.value}
                                    onChange={handleCardTitleInput}
                                    onBlur={updateCardTitle}
                                    onKeyDown={(e) => {
                                      (e.code === 'NumpadEnter' ||
                                        e.code === 'Enter') &&
                                        updateCardTitle();
                                    }}
                                  />
                                ) : (
                                  <>
                                    <p className="text-sm">{card.title}</p>
                                    <div className="flex items-center gap-1 absolute top-1 right-1 opacity-0 group-hover:opacity-100 duration-500">
                                      <button
                                        className="w-5 h-5 bg-slate-200 rounded-sm flex justify-center items-center text-black"
                                        onClick={
                                          card.lock
                                            ? showLockCardErrorMsg
                                            : () =>
                                                setCardEditTarget({
                                                  groupI,
                                                  cardI,
                                                  value: card.title,
                                                })
                                        }
                                      >
                                        <i className="bi bi-pencil-square"></i>
                                      </button>
                                      <button
                                        className="w-5 h-5 bg-slate-200 rounded-sm flex justify-center items-center text-black"
                                        onClick={
                                          card.lock
                                            ? showLockCardErrorMsg
                                            : () =>
                                                deleteCard({
                                                  groupI,
                                                  cardI,
                                                })
                                        }
                                      >
                                        <i className="bi bi-trash"></i>
                                      </button>
                                      <button
                                        className="w-5 h-5 bg-slate-200 rounded-sm flex justify-center items-center text-black"
                                        onClick={() =>
                                          handleCardLock(
                                            {
                                              groupI,
                                              cardI,
                                            },
                                            !card.lock
                                          )
                                        }
                                      >
                                        <i
                                          className={clsx(
                                            'bi',
                                            card.lock ? 'bi-lock' : 'bi-unlock'
                                          )}
                                        ></i>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                          //card/
                        )
                      : null}
                    <AddNewListItemForm
                      className="px-1 pb-1"
                      groupI={groupI}
                      onSave={onSaveNewCard}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        <AddNewListForm onSave={onSaveNewGroup} />
      </div>
    </>
  );
}

export default BoardPage;
