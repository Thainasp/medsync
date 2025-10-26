import { useForm } from "react-hook-form";

import { FormContainer, Label, Title, InputField, ErrorMessage } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";
import { useNavigate } from "react-router-dom";

export function RecuperacaoSenha() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm(); 

    const navigateLogin = useNavigate();
  const handleClickLogin = () => {
        navigateLogin("/login");
    }

  return (
    <div className="recuperacao-container">
        <TelaBase>
            <Header />
            <Title>Recupere sua senha</Title>
            <FormContainer onSubmit={handleSubmit(() => {})}>

                <Label htmlFor="email">Email</Label>
                <InputField
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email é obrigatório"
                  })}
                  placeholder="Insira seu email"/>
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                <MyButton disabled={isSubmitting} type="submit">{isSubmitting ? "Enviando..." : "Enviar"}</MyButton>

                <MyButton type="button" onClick={handleClickLogin}>Voltar</MyButton>
            </FormContainer>
            <Footer />        
        </TelaBase>
    </div>
    );
}