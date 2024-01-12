import { db } from "@/lib/db/index";
import { type MediaId, mediaIdSchema } from "@/lib/db/schema/medias";

export const getMedias = async () => {
  const m = await db.media.findMany({
    include: { task: true },
  });
  return { medias: m };
};

export const getMediaById = async (id: MediaId) => {
  const { id: mediaId } = mediaIdSchema.parse({ id });
  // @ts-ignore
  const m = await db.media.findFirst({
    where: { id: mediaId },
    include: { task: true },
  });
  return { medias: m };
};
