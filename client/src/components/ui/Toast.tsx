interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export const Toast = ({
  message,
  type,
}: ToastProps) => {
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900';
      case 'error':
        return 'bg-red-500';
    }
  };

  return (
    <div
      className={`w-full py-6 px-12 rounded-lg shadow-sm flex flex-col  ${getBgColor()}`}
    >
      <div className="flex justify-between items-center w-full">
          <div className="text-sm font-normal text-white fon-bold text-md">{message}</div>
      </div>
    </div>
  );
};
