"use client";
import { useGetSingleUserQuery } from "@/store/apis/auth/authentication.api";
import UserForm from "../../form";
import ErrorComponent from "@/components/dashboard/ErrorComponent";
import { normalizeRtkError } from "@/lib/normalizeRtkError";
import { UserInterface } from "@/types/auth.types";

type Params = Readonly<{ id: string }>;

const EditUserComponent = ({ params }: Readonly<{ params: Params }>) => {
  const { data: user, error } = useGetSingleUserQuery(params.id);

  return (
    <div className="py-6">
      {user && <UserForm initial={user as unknown as UserInterface} id={user.id} isUpdate />}
      {error && <ErrorComponent error={normalizeRtkError(error)} />}
    </div>
  );
};

export default EditUserComponent;

