import { CircularProgress } from "@nextui-org/progress";

export function ZLoading() {
  return (
    <div className="absolute top-0 left-0 z-50 h-[100vh] w-full bg-white flex justify-center items-center">
      <CircularProgress label="Hang on..." />
    </div>
  );
}
