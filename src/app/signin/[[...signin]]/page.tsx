import { SignIn } from "@clerk/nextjs";
const page = () => {
  return (
    <div className="flex justify-center items-center font-balsamiq min-h-screen ">
      <SignIn />
    </div>
  );
};

export default page;
