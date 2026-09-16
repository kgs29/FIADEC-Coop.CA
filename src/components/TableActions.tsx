"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit2,
  Eye,
  MoreVertical,
  RotateCw,
  Trash,
  Trash2,
  Upload,
  Webhook,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Trans, useTranslation } from "react-i18next";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "@/hooks/redux-toolkit";

interface TableActionProps {
  rowSelected: string[] | number[];
  singleActionVisible?: boolean
  deleteVisible?: boolean
  updateVisible?: boolean
  singleDelete: {
    isLoading: boolean;
    handleDelete: () => void;
  };
  actionsClicked: () => void;
  setUpOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadViaXroadOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setDelOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  canUploadSelected?: boolean;
  multipleUploadContent?: React.ReactNode;
}

const TableActions: React.FC<TableActionProps> = ({
  rowSelected,
  deleteVisible = true,
  updateVisible = true,
  actionsClicked,
  setUpOpen,
  setDelOpen,
  singleDelete: _singleDelete,
  setUploadOpen,
  setUploadViaXroadOpen,
  singleActionVisible = true,
}) => {
  const [openDropdown, setDropdownOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const [openSingleDelete, setOpenSingleDelete] = useState<boolean>(false);
  const _dispatch = useAppDispatch();

  const geoSelectedIds = [];

  return (
    <div>
      <DropdownMenu
        open={openDropdown}
        onOpenChange={() => {
          setDropdownOpen(!openDropdown);
          if (geoSelectedIds.length > 0) return;
          actionsClicked();
        }}
        key={"action-button"}
      >
        <DropdownMenuTrigger className="flex justify-center items-center h-3">
          <DropdownMenuLabel className="text-sm">Actions</DropdownMenuLabel>
          <MoreVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={``}>
          {rowSelected.length === 1 && singleActionVisible && (
            <>
              <DropdownMenuItem>
                <Link
                  href={`${pathname}/${rowSelected[0]}`}
                  className="flex gap-2 items-center"
                >
                  <Eye /> <Trans i18nKey={"details"} />
                </Link>
              </DropdownMenuItem>
              {updateVisible && (
                <DropdownMenuItem>
                  <Link
                    href={`${pathname}/${rowSelected[0]}/edit`}
                    className="flex gap-2 items-center"
                  >
                    <Edit2 /> <Trans i18nKey={"edit"} />
                  </Link>
                </DropdownMenuItem>
              )}

              {deleteVisible && (
                <DropdownMenuItem
                  onClick={() => {
                    setDropdownOpen(false);
                    setOpenSingleDelete(true);
                  }}
                >
                  <Trash /> <Trans i18nKey={"delete"} />
                </DropdownMenuItem>
              )}

            </>
          )}
          {setUpOpen && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="ml-auto w-full flex cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setUpOpen(true);
                }}
              >
                <RotateCw />
                {rowSelected.length > 1
                  ? t("change_multiple_state")
                  : t("change_state")}
              </DropdownMenuItem>
            </>
          )}
          {setDelOpen && rowSelected.length > 1 && (
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                setDelOpen(true);
              }}
              className="ml-auto h-8 flex cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              {t("multiple_delete")}
            </DropdownMenuItem>
          )}
          {setUploadOpen && rowSelected.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="ml-auto w-full flex cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setUploadOpen(true);
                }}
              >
                <Upload />
                {t("Import_file")}
              </DropdownMenuItem>
            </>
          )}

          {setUploadViaXroadOpen && rowSelected.length >= 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="ml-auto w-full flex cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setUploadViaXroadOpen(true);
                }}
              >
                <Webhook />
                {t("X-ROAD")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={openSingleDelete} onOpenChange={setOpenSingleDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete")}</DialogTitle>
            <DialogDescription>
              {t("do_you_really_want_to_delete")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button aria-label={t("cancel")} onClick={() => setOpenSingleDelete(false)} variant={"link"}>
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableActions;
