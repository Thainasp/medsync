import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormContainer, Label, Title, InputField, ErrorMessage } from "../components/forms";
import { Footer } from "../components/footer";
import { TelaBase } from "../components/telaBase";
import { Header } from "../components/header";
import { MyButton } from "../components/myButton";

export function RecuperacaoSenha() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm(); 
  const navigate = useNavigate();

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

          // 🚀 MÁGICA AQUI: Se tiver link de preview (Ethereal), mostramos pro usuário
          if (responseData.previewUrl) {
             // Copia para o clipboard para facilitar
             await navigator.clipboard.writeText(responseData.previewUrl);
             
             // Abre em nova aba se o navegador permitir
             window.open(responseData.previewUrl, "_blank");

             alert(`Sucesso! (MODO TESTE)\n\nO link do e-mail foi copiado para sua área de transferência e tentamos abri-lo.\n\nCaso não abra, cole no navegador:\n${responseData.previewUrl}`);
          } else {
             alert("Sucesso! Uma nova senha provisória foi enviada para o seu e-mail.");
          }
          
          navigate("/login");

      } catch (error) {
          setError("email", { message: error.message });
      }
  }

  return (
    <div className="recuperacao-container">
        <TelaBase>
            <Header />
            <Title>Recupere sua senha</Title>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
                <p style={{textAlign: "center", fontSize: "14px", color: "#666", marginBottom: "20px"}}>
                    (Modo Desenvolvimento: O e-mail abrirá na sua tela)
                    <br/>Informe seu e-mail cadastrado.
                </p>

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
                    {isSubmitting ? "Gerando nova senha..." : "Receber Nova Senha"}
                </MyButton>

                <MyButton type="button" onClick={handleClickLogin}>Voltar</MyButton>
            </FormContainer>
            <Footer />        
        </TelaBase>
    </div>
    );
}