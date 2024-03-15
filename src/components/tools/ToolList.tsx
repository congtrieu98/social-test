"use client";
import { CompleteTool } from "@/lib/db/schema/tools";
import { trpc } from "@/lib/trpc/client";
import ToolModal from "./ToolModal";


export default function ToolList({ tools }: { tools: CompleteTool[] }) {
  const { data: t } = trpc.tools.getTools.useQuery(undefined, {
    initialData: { tools },
    refetchOnMount: false,
  });

  if (t.tools.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {t.tools.map((tool) => (
        <Tool tool={tool} key={tool.id} />
      ))}
    </ul>
  );
}

const Tool = ({ tool }: { tool: CompleteTool }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{tool.name}</div>
      </div>
      <ToolModal tool={tool} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No tools</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new tool.
      </p>
      <div className="mt-6">
        <ToolModal emptyState={true} />
      </div>
    </div>
  );
};

