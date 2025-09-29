const Flex = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export default Flex;
