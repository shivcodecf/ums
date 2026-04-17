const Button = ({
  children,
  loading = false,
  loadingText = "Loading...",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const base = "rounded-lg transition font-medium";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-300 hover:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? loadingText : children}
    </button>
  );
};

export default Button;