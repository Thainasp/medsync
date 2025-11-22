import React, { useState } from "react"; // Adicionado useState
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormContainer, Label, Title, InputField, ErrorMessage, Paragraph, Alinha } from "../components/forms";
import { Footer } from "../components/footer";
import { TelaBase } from "../components/telaBase";
import { Header } from "../components/header";
import { MyButton } from "../components/myButton";

// IMPORTS DO OVERLAY
import {
  OverlayContainer,
  OverlayContent,
  OverlayIcon,
  OverlayTitle,
  OverlayText,
} from "../components/overlay";

export function RecuperacaoSenha() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm(); 
  const navigate = useNavigate();
  
  // Estado para controlar o pop-up de sucesso
  const [sucessoEnviado, setSucessoEnviado] = useState(false);

  const handleClickLogin = () => {
      navigate("/login");
  }

  const onSubmit = async (data) => {
      try {
          const response = await fetch('http://localhost:3001/pacientes/recuperar-senha', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email: data.email })
          });

          const responseData = await response.json();

          if (!response.ok) {
              throw new Error(responseData.erro || "Erro ao enviar e-mail");
          }

          // Exibe o pop-up de sucesso
          setSucessoEnviado(true);

          // Aguarda 4 segundos para leitura e redireciona para o login
          setTimeout(() => {
             setSucessoEnviado(false);
             navigate("/login");
          }, 4000);

      } catch (error) {
          setError("email", { message: error.message });
      }
  }

  return (
    <div className="recuperacao-container">
        <TelaBase>
            <Header />

            {/* --- POP-UP DE SUCESSO --- */}
            {sucessoEnviado && (
                <OverlayContainer>
                    <OverlayContent>
                        <OverlayIcon src="/assets/images/imgaalerta.svg" alt="Sucesso" />
                        <OverlayTitle>E-mail enviado!</OverlayTitle>
                        <OverlayText style={{ textAlign: 'center' }}>
                            Instruções de recuperação enviadas com sucesso.
                            Caso não localize o email, verifique a caixa de spam.
                        </OverlayText>
                    </OverlayContent>
                </OverlayContainer>
            )}

            <Title>Recupere sua senha</Title>

            <Alinha>
                <Paragraph>
                Informe seu e-mail cadastrado para receber uma nova senha provisória.
                </Paragraph>
            </Alinha>
            
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                
                <Label htmlFor="email">Email</Label>
                <InputField
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Insira um e-mail válido"
                    }
                  })}
                  placeholder="Insira seu email cadastrado"/>
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                <MyButton disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Enviando..." : "Receber Nova Senha"}
                </MyButton>

                <MyButton type="button" onClick={handleClickLogin}>Voltar</MyButton>
            </FormContainer>
            <Footer />        
        </TelaBase>
    </div>
    );
}