import { useForm } from "react-hook-form";


import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage, InputCheckbox, DivCheckbox, Paragraph } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";
import { Link } from "react-router-dom";

export function Cadastro() {
    const { register, watch, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();

    const brTelefonePattern = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/;
    const senhaPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    const senha = watch("senha");

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
                <Title>Cadastre-se</Title>
                <FormContainer onSubmit={handleSubmit(onSubmit)}>

                    <Label htmlFor="nome">Nome</Label>
                    <InputField {...register("nome")} placeholder="Insira seu nome" /> {errors.nome && <ErrorMessage>Este campo é obrigatório</ErrorMessage>}

                    <Label htmlFor="email">Email</Label>
                    <InputField
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email é obrigatório",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email inválido"
                            }
                        })}
                        placeholder="Insira seu email"
                    />

                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

                    <Label htmlFor="telefone">Telefone</Label>
                    <InputField
                        id="telefone"
                        type="tel"
                        {...register("telefone", {
                            required: "Telefone é obrigatório",
                            pattern: {
                                value: brTelefonePattern,
                                message: "Telefone inválido. Formato esperado: (XX) XXXXX-XXXX"
                            }
                        }
                        )} placeholder="Insira seu telefone" /> {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}

                    <Label htmlFor="senha">Senha</Label>
                    <InputField
                        id="senha"
                        type="password"
                        {...register("senha", {
                            required: "Senha é obrigatória",
                            pattern: {
                                value: senhaPattern,
                                message: "Senha inválida. \nDeve ter pelo menos um número, um \ncaractere especial e ter entre 6 a 16 caracteres."
                            }
                        })} placeholder="Insira sua senha" /> {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}


                    <Label htmlFor="confirmaSenha">Repita sua senha</Label>
                    <InputField
                        id="confirmaSenha"
                        type="password"
                        {...register("confirmaSenha", {
                            validate: value => value === senha || "As senhas não coincidem"
                        })} placeholder="Repita sua senha" /> {errors.confirmaSenha && <ErrorMessage>{errors.confirmaSenha.message}</ErrorMessage>}

                    <DivCheckbox>
                        <InputCheckbox
                            id="termos"
                            type="checkbox"
                            {...register("termos", { required: "Aceite os termos de uso" })} /> Aceito os termos de uso
                    </DivCheckbox>
                    {errors.termos && <ErrorMessage>{errors.termos.message}</ErrorMessage>}


                    <MyButton disabled={isSubmitting} type="submit">{isSubmitting ? "Cadastrando..." : "Cadastrar"}</MyButton>

                </FormContainer>

                <StyledDivLinks>
                    <Link to={"/login"}>Já tem uma conta? Faça o login</Link>
                </StyledDivLinks>
                
                <Footer />
            </TelaBase>
        </div>
    );
}
