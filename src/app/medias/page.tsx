/* eslint-disable @next/next/no-img-element */
"use client";

import { trpc } from "@/lib/trpc/client";

const Medias = () => {
  const { data: m } = trpc.medias.getMedias.useQuery();

  return (
    <>
      <div className="text-xl font-semibold mb-5">Danh sách ảnh đã xóa</div>
      {m?.medias
        .filter((item) => item?.status === "disable")
        .map((med, index) => {
          return <div key={index}>
            <img src={med?.url} alt="" />;
          </div>
        })}
    </>
  );
};

export default Medias;
