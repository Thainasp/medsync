import { useForm } from "react-hook-form";
import styled from "styled-components";

import { FormContainer, Label, InputField, ErrorMessage } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";


const BackgroundLoginDiv = styled.div`
      background-image: url("./public/assets/images/background-login.jpg");
      width: 105%;
      `;

export function Login() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
    } catch (error) {
      setError("email", { message: "E-mail não encontrado. Verifique e tente novamente ", error });
    }
  }

    return (
      <div className="login-container">
        <TelaBase>
          <Header />
          <h1>Acesse</h1>
          <FormContainer onSubmit={handleSubmit(onSubmit)}>

            <Label htmlFor="email">Email</Label>
            <InputField {...register("email")} placeholder="Insira seu email" /> {errors.email && <ErrorMessage>Este campo é obrigatório</ErrorMessage>}

            <Label htmlFor="senha">Senha</Label>
            <InputField {...register("senha")} placeholder="Insira sua senha" /> {errors.senha && <ErrorMessage>Este campo é obrigatório</ErrorMessage>}

            <MyButton disabled={isSubmitting} type="submit">{isSubmitting ? "Acessando..." : "Entrar"}</MyButton>
            <p>Esqueceu a senha? Clique aqui!</p>
            <p>Novo por aqui? Cadastre-se</p>
          </FormContainer>
          <Footer />
        </TelaBase>
      </div>
    );
  }
