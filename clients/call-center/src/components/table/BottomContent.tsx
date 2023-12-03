import { Pagination } from "@nextui-org/react";

export interface BottomContentProps {
  page: number;
  pages: number;
  setPage: (page: number) => void;
}

export function BottomContent({ page, pages, setPage }: BottomContentProps) {
  if (pages === 0) return null;
  return (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={(page) => setPage(page)}
      />
    </div>
  );
}
