"use client";

import { trpc } from "@/lib/trpc/client";

const Medias = () => {
  const { data: m } = trpc.medias.getMedias.useQuery();

  return (
    <>
      <div className="text-xl font-semibold mb-5">Danh sách ảnh đã xóa</div>
      {m?.medias
        .filter((item) => item?.status === "disable")
        .map((med) => {
          return <img src={med?.url} />;
        })}
    </>
  );
};

export default Medias;
