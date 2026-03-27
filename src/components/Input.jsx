export default function Input({
  id,
  name = 'app_input',
  autoComplete = 'off',
  ...props
}) {
  return (
    <input
      id={id}
      name={name}
      autoComplete={autoComplete}
      className="input"
      placeholder="Input"
      {...props}
    />
  )
}
