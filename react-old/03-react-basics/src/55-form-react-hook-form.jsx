import { useForm } from "react-hook-form";

const FormReactHookForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => alert(values.email + " " + values.password);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="input-control ">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "invalid email address",
            },
          })}
        />
        {errors.email && errors.email.message}
      </div>
      <div className="input-control ">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Required",
            pattern: {
              value:
                /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
              message:
                "Password requirements: 8-20 characters, 1 number, 1 letter, 1 symbol.",
            },
          })}
        />
        {errors.password && errors.password.message}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormReactHookForm;
