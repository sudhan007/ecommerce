import { CircularProgress } from "@nextui-org/progress";

export default function loading() {
  return (
    <div className="h-[75vh] w-full bg-white flex justify-center items-center">
      <CircularProgress label="Hang on..." />
    </div>
  );
}
