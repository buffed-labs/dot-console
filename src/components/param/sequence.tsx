import { TooltipBox } from "../tooltip-box";
import { Button } from "../ui/button";
import { IconButton } from "../ui/icon-button";
import { CodecParam } from "./codec";
import { CollapsibleParam } from "./collapsible";
import {
  INCOMPLETE,
  INVALID,
  type ParamInput,
  type ParamProps,
} from "./common";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  Decoded,
  SequenceDecoded,
  SequenceShape,
} from "@polkadot-api/view-builder";
import AddIcon from "@w3f/polkadot-icons/solid/Add";
import CloseIcon from "@w3f/polkadot-icons/solid/Close";
import CopyIcon from "@w3f/polkadot-icons/solid/Copy";
import MoreMenuIcon from "@w3f/polkadot-icons/solid/MoreMenu";
import {
  type PropsWithChildren,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { css } from "styled-system/css";

export type SequenceParamProps<T> = ParamProps<T[]> & {
  sequence: SequenceShape;
  defaultValue: SequenceDecoded | undefined;
};

type SortableValue<T> = {
  id: string;
  value: T;
  defaultValue?: Decoded | undefined;
};

export function SequenceParam<T>({
  sequence,
  defaultValue,
  onChangeValue,
}: SequenceParamProps<T>) {
  const [length, setLength] = useState(defaultValue?.value.length ?? 1);

  const defaultValues = useMemo(
    () =>
      Array.from({ length }).map(
        (_, index): SortableValue<ParamInput<T>> => ({
          id: globalThis.crypto.randomUUID(),
          value: INCOMPLETE,
          defaultValue: defaultValue?.value.at(index),
        }),
      ),
    [defaultValue?.value, length],
  );

  const [sortableValues, setSortableValues] = useState(defaultValues);

  const values = useMemo(
    () => sortableValues.map((value) => value.value),
    [sortableValues],
  );

  const derivedValue = useMemo(
    () =>
      values.includes(INCOMPLETE)
        ? INCOMPLETE
        : values.includes(INVALID)
          ? INVALID
          : (values as T[]),
    [values],
  );

  const increaseLength = () => {
    setLength((length) => length + 1);
    setSortableValues((value) => [
      ...value,
      { id: globalThis.crypto.randomUUID(), value: INCOMPLETE },
    ]);
  };

  const onChangeDerivedValue = useEffectEvent(
    (value: T[] | typeof INCOMPLETE | typeof INVALID) => onChangeValue(value),
  );

  useEffect(() => onChangeDerivedValue(derivedValue), [derivedValue]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={({ active, over }) => {
          if (over !== null && active.id !== over.id) {
            setSortableValues((items) => {
              const oldIndex = items.findIndex((item) => item.id === active.id);
              const newIndex = items.findIndex((item) => item.id === over.id);

              return arrayMove(items, oldIndex, newIndex);
            });
          }
        }}
      >
        <SortableContext
          items={sortableValues.map((value) => value.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortableValues.map((item, index, array) => (
            <SortableItem
              key={item.id}
              id={item.id}
              index={index}
              sortable={array.length > 1}
              onRequestRemove={() =>
                setSortableValues((values) =>
                  values.filter((value) => value.id !== item.id),
                )
              }
              onRequestDuplicate={() => {
                setLength((length) => length + 1);
                setSortableValues((values) => [
                  ...values.slice(0, index + 1),
                  {
                    id: globalThis.crypto.randomUUID(),
                    value: values.at(index)?.value ?? INCOMPLETE,
                    defaultValue: defaultValues.at(index)?.defaultValue,
                  },
                  ...values.slice(index + 1),
                ]);
              }}
            >
              <CodecParam
                shape={sequence.shape}
                defaultValue={item.defaultValue}
                onChangeValue={(value) =>
                  setSortableValues((array) => {
                    const id = array[index]?.id;

                    if (id === undefined) {
                      return array;
                    }

                    return array.with(index, {
                      id,
                      value: value as ParamInput<T>,
                    });
                  })
                }
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      <div
        className={css({
          display: "flex",
          gap: "0.5rem",
          marginTop: "0.5rem",
        })}
      >
        <Button size="xs" onClick={increaseLength}>
          Add item <AddIcon fill="currentcolor" />
        </Button>
      </div>
    </div>
  );
}

type SortableItemProps = PropsWithChildren<{
  id: string;
  index: number;
  sortable?: boolean;
  onRequestRemove: () => void;
  onRequestDuplicate: () => void;
}>;

export function SortableItem({
  id,
  index,
  sortable,
  onRequestRemove,
  onRequestDuplicate,
  children,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CollapsibleParam
      style={style}
      label={`Item ${index + 1}`}
      leadingLabel={
        sortable && (
          <IconButton
            ref={setNodeRef}
            variant="ghost"
            size="xs"
            className={css({
              cursor: "grab",
              "&:active:hover": { cursor: "grabbing" },
            })}
            {...attributes}
            {...listeners}
          >
            <div>
              <MoreMenuIcon fill="currentcolor" />
            </div>
          </IconButton>
        )
      }
      trailingLabel={
        <TooltipBox tooltip="Delete item">
          <IconButton variant="ghost" size="xs" onClick={onRequestRemove}>
            <CloseIcon fill="currentcolor" />
          </IconButton>
        </TooltipBox>
      }
    >
      <div
        className={css({
          display: "flex",
          // gap: "0.5rem",
          "&>*:first-child": { flex: 1 },
        })}
      >
        <div>{children}</div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
          })}
        >
          <TooltipBox tooltip="Duplicate item">
            <IconButton variant="ghost" size="xs" onClick={onRequestDuplicate}>
              <CopyIcon fill="currentcolor" />
            </IconButton>
          </TooltipBox>
        </div>
      </div>
    </CollapsibleParam>
  );
}
