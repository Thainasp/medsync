import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";

export function Login() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate(); 

  const onSubmit = async (data) => {
    try {
      // CORREÇÃO: Rota ajustada para /pacientes/login
      const response = await fetch('http://localhost:3001/pacientes/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            senha: data.senha
          })
      });

      const responseData = await response.json();

      if (!response.ok) {
          throw new Error(responseData.erro || "Falha ao entrar");
      }

      // SALVANDO O TOKEN E DADOS DO USUÁRIO
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('usuarioNome', responseData.nome);
      localStorage.setItem('usuarioId', responseData.id);

      // Redireciona para a tela inicial protegida
      navigate("/inicio"); 

    } catch (error) {
      console.error(error);
      // Define erro nos campos para feedback visual
      setError("email", { message: "E-mail ou senha incorretos." });
      setError("senha", { message: "Verifique suas credenciais." });
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
            })} placeholder="Insira sua senha" /> 
            {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}

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