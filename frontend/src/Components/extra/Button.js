const Button = (props) => {
  const { newClass, btnColor, btnName, onClick,type, style, btnIcon, disabled , id } =
    props;

  return (
    <>
      <button
        className={`themeBtn text-center ${newClass} ${btnColor}`}
        onClick={onClick}
        style={style}
        disabled={disabled}
        type={type}
        id={id}
      >
        {btnIcon ?
        <>
          <i className={btnIcon}></i> <span className="">{btnName}</span>
        </>
        : btnName}
      </button>
    </>
  );
};

export default Button;
