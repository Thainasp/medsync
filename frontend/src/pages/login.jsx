import React, { useState } from "react"; // Adicionado useState
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage, DeleteButton } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";

import {
  OverlayContainer,
  OverlayTitle,
  OverlayContent,
  CancelButton,
  OverlayText,
} from "../components/overlay";

export function Login() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  
  // ESTADO PARA CONTROLAR O POP-UP
  const [showUserNotFound, setShowUserNotFound] = useState(false);

  const onSubmit = async (data) => {
    try {
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
          // Se o erro for "Usuário não encontrado" (ou 404), ativamos o popup.
          // Ajuste a string abaixo conforme o retorno exato da sua API.
          if (response.status === 404 || responseData.erro === "Usuário não encontrado") {
             setShowUserNotFound(true);
             return; // Para a execução aqui para não setar erro no input
          }
          
          throw new Error(responseData.erro || "Falha ao entrar");
      }

      // SALVANDO O TOKEN E DADOS DO USUÁRIO
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('usuarioNome', responseData.nome);
      localStorage.setItem('usuarioId', responseData.id);

      navigate("/inicio"); 

    } catch (error) {
      console.error(error);

      setError("email", { message: "E-mail ou senha incorretos." });
      setError("senha", { message: "Verifique suas credenciais." });
    }
  }

  return (
    <div className="login-container">
      <TelaBase>
        <Header />

        {/* --- INÍCIO DO POP-UP (OVERLAY) --- */}
        {showUserNotFound && (
          <OverlayContainer>
            <OverlayContent>
              
              <OverlayTitle>Usuário não encontrado</OverlayTitle>
              
              <OverlayText>
                Não encontramos um cadastro com estes dados.
              </OverlayText>

                <MyButton onClick={() => navigate("/cadastro")}>
                  Deseja se cadastrar?
                </MyButton>
                
                <CancelButton onClick={() => setShowUserNotFound(false)}>
                  Tentar novamente
                </CancelButton>
            </OverlayContent>
          </OverlayContainer>
        )}
        {/* --- FIM DO POP-UP --- */}

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