"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";

interface AlbumCardProps {
  id: string | number;
  title: string;
  artist?: string;
  cover: string;
}

const AlbumCard = ({ title, artist, cover, id }: AlbumCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [openDialog, setOpenDialog] = useState(false);
  // const [loading, setLoading] = useState(false);

  const navigatePage = (id: string | number): void => {
    if (window.location.pathname.includes("admin")) {
      navigate(`/admin-dashboard/albums/${id}`);
    } else {
      navigate(`/albums/${id}`);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    try {
      // setLoading(true);
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Album deleted:", id);
      setOpenDialog(false);
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <>
      <Card
        onClick={() => navigatePage(id)}
        className="p-0 group cursor-pointer relative max-w-[250px] w-full rounded-2xl overflow-hidden shadow-md hover:shadow-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-md border border-border/50 transition-all duration-300"
      >
        {user?.role === "admin" && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
              className="rounded-full bg-red-500 absolute  right-1 h-8 w-8 top-1 z-[50] cursor-pointer hover:bg-red-400"
            >
              <Trash2 className=" text-white" />
            </Button>
          )}

        {/* Album Cover */}
        <div>
          <img
            src={cover}
            alt={title}
            className="h-[150px] w-full object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Album Info */}
        <CardContent className="p-4">
          <h3 className="font-semibold truncate text-base">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Delete Album"
        itemName={title}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AlbumCard;
