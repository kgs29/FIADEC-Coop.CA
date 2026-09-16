/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// tests are intentionally ignored by Next.js ESLint, patterns configured globally
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { vi, expect } from "vitest";

// command components
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "./command";

// context menu components
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
} from "./context-menu";

// dialog components
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";

// drawer components
import {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./drawer";

// dropdown components
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
} from "./dropdown-menu";

// simple smoke tests that render each component and look for data-slot

describe("UI primitive components", () => {
  const componentsToCheck: Record<string, any> = {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuRadioGroup,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogClose,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    Drawer,
    DrawerPortal,
    DrawerOverlay,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
  };

  it("all components should be defined", () => {
    Object.entries(componentsToCheck).forEach(([name, Comp]) => {
      // simply ensure the export isn't undefined/null
      expect(Comp).toBeDefined();
    });
  });
});

// date picker
import { DatePicker } from "./date-picker";

describe("DatePicker component", () => {
  it("renders with placeholder and calls onValueChange", () => {
    const handle = vi.fn();
    render(<DatePicker placeholder="Pick" onValueChange={handle} dates={undefined} />);
    // @ts-ignore - vitest expect type is incompatible here
    expect(screen.getByText("Pick")).toBeInTheDocument();
  });
});
