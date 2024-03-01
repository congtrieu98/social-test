import StaffList from "@/components/staffs/staffList";
import StaffModal from "@/components/staffs/staffModal";
import { getStaffs } from "@/lib/api/staffs/queries";
import { checkAuth } from "@/lib/auth/utils";

const Staffs = async () => {
  await checkAuth();
  const { staffs } = await getStaffs();
  //@ts-ignore
  return (
    <main className="max-w-full mx-auto p-5 md:p-0 sm:pt-4">
      <div className="flex justify-between">
        {staffs.length > 0 && (
          <h1 className="font-semibold text-[18px] my-2">
            Danh sách nhân viên
          </h1>
        )}
        {staffs.length > 0 && <StaffModal />}
      </div>
      <StaffList staffs={staffs} />
    </main>
  );
};

export default Staffs;
