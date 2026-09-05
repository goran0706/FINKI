import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters." }),
});

type FormData = z.infer<typeof schema>;

const FormValidationSchema = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FieldValues) => console.log(data);

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          {...register("username", { required: true, minLength: 3 })}
          id="username"
          type="text"
          className="form-control"
        />
        {errors.username && (
          <p className="text-danger">{errors.username.message}</p>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          {...register("password", { required: true })}
          id="password"
          type="password"
          className="form-control"
        />
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={!isValid}
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </button>
    </form>
  );
};

export default FormValidationSchema;
