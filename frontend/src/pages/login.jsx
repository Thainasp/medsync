import { useForm } from "react-hook-form";

import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";
import { Link } from "react-router-dom";

export function Login() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data); // substituir para mandar para o backend
    } catch (error) {
      setError("email", { message: "E-mail não encontrado. Verifique e tente novamente ", error });
    }
  }

  return (
    <div className="login-container">
      <TelaBase>
        <Header />
        <Title>Acesse</Title>
        <FormContainer onSubmit={handleSubmit(onSubmit)}>

          <Label htmlFor="email">Email</Label>
          <InputField
            id="email"
            type="email"
            {...register("email", {
              required: "Email é obrigatório"
            })}
            placeholder="Insira seu email" />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

          <Label htmlFor="senha">Senha</Label>
          <InputField
            id="senha"
            type="password"
            {...register("senha", {
              required: "Senha é obrigatória"
            })} placeholder="Insira sua senha" /> {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}

          <MyButton disabled={isSubmitting} type="submit">{isSubmitting ? "Acessando..." : "Entrar"}</MyButton>

        </FormContainer>
        <StyledDivLinks >
          <Link to="/recuperacaoSenha">Esqueceu a senha?  Clique aqui!</Link>

          <Link to={"/cadastro"}>Novo por aqui? Cadastre-se</Link>
        </StyledDivLinks>

        <Footer />
      </TelaBase>
    </div>
  );
}
