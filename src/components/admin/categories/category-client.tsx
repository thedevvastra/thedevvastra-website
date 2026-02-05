"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  GripVertical,
  CornerDownRight,
  Edit,
  ChevronRight,
  ChevronDown,
  Layers,
  ImageIcon,
} from "lucide-react";
import { CategorySheet } from "./category-sheet";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  deleteCategory,
  updateCategoryOrder,
} from "@/app/(admin)/admin/categories/actions";
import { toast } from "sonner";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

export function CategoryClient({ categories }: { categories: any[] }) {
  const [items, setItems] = useState(categories);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State to manage expanded/collapsed categories
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    await deleteCategory(deleteId);
    setIsLoading(false);
    setDeleteOpen(false);
    toast.success("Category deleted");
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "MAIN") {
      const reorderedItems = Array.from(items);
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);
      setItems(reorderedItems);

      const updates = reorderedItems.map((item, index) => ({
        id: item.id,
        sortOrder: index,
      }));
      await updateCategoryOrder(updates);
      toast.success("Main category order updated");
    } else if (type === "SUB") {
      const parentId = source.droppableId;
      const parentIndex = items.findIndex((c) => c.id === parentId);
      if (parentIndex === -1) return;

      const parent = items[parentIndex];
      const newChildren = Array.from(parent.children);
      const [movedChild] = newChildren.splice(source.index, 1);
      newChildren.splice(destination.index, 0, movedChild);

      const newItems = [...items];
      newItems[parentIndex] = { ...parent, children: newChildren };
      setItems(newItems);

      const updates = newChildren.map((item: any, index) => ({
        id: item.id,
        sortOrder: index,
      }));
      await updateCategoryOrder(updates);
      toast.success("Sub-category order updated");
    }
  };

  return (
    <div className="space-y-6">
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={isLoading}
        title="Delete Category?"
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" /> Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize your product catalog structure.
          </p>
        </div>
        <CategorySheet existingCategories={items} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="main-categories" type="MAIN">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {items.map((mainCat, index) => (
                <Draggable
                  key={mainCat.id}
                  draggableId={mainCat.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "transition-all duration-200 border-l-4",
                        snapshot.isDragging
                          ? "shadow-2xl border-l-primary scale-[1.02] bg-accent"
                          : "border-l-transparent hover:border-l-primary/50 bg-card",
                      )}
                    >
                      {/* Main Category Row */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>

                          {/* Collapse Toggle */}
                          <button
                            onClick={() => toggleExpand(mainCat.id)}
                            className="p-1 hover:bg-muted rounded text-muted-foreground"
                          >
                            {expanded[mainCat.id] ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </button>

                          {/* Image Thumbnail */}
                          <div className="h-10 w-10 rounded-md border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                            {mainCat.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={mainCat.imageUrl}
                                alt={mainCat.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {mainCat.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-5"
                              >
                                {mainCat.children?.length || 0} Sub
                              </Badge>
                            </div>
                            <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              /{mainCat.slug}
                            </code>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <CategorySheet
                            existingCategories={items}
                            initialData={mainCat}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </CategorySheet>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setDeleteId(mainCat.id);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Sub Categories (Collapsible) */}
                      {expanded[mainCat.id] && (
                        <Droppable droppableId={mainCat.id} type="SUB">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="bg-muted/30 border-t p-2 space-y-2 pl-12 pr-4 pb-4 animate-in slide-in-from-top-2"
                            >
                              {mainCat.children?.length === 0 && (
                                <p className="text-sm text-muted-foreground italic py-2">
                                  No sub-categories. Drag items here or add new.
                                </p>
                              )}

                              {mainCat.children?.map(
                                (sub: any, subIndex: number) => (
                                  <Draggable
                                    key={sub.id}
                                    draggableId={sub.id}
                                    index={subIndex}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded-md border transition-all",
                                          snapshot.isDragging
                                            ? "shadow-lg bg-background border-primary"
                                            : "bg-background border-border hover:border-primary/30",
                                        )}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="cursor-grab text-muted-foreground"
                                          >
                                            <GripVertical className="h-4 w-4" />
                                          </div>
                                          <CornerDownRight className="h-4 w-4 text-muted-foreground/50" />

                                          {/* Sub Image (Optional, small) */}
                                          {sub.imageUrl && (
                                            <img
                                              src={sub.imageUrl}
                                              alt=""
                                              className="h-6 w-6 rounded object-cover border"
                                            />
                                          )}

                                          <span className="text-sm font-medium">
                                            {sub.name}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            ({sub.slug})
                                          </span>
                                        </div>

                                        <div className="flex items-center">
                                          <CategorySheet
                                            existingCategories={items}
                                            initialData={sub}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-7 w-7"
                                            >
                                              <Edit className="h-3.5 w-3.5" />
                                            </Button>
                                          </CategorySheet>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                              setDeleteId(sub.id);
                                              setDeleteOpen(true);
                                            }}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ),
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
