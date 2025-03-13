import { SignUp } from "@clerk/nextjs";
const page = () => {
  return (
    <div className="flex justify-center items-center font-balsamiq min-h-screen ">
      <SignUp />
    </div>
  );
};

export default page;
