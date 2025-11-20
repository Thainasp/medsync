import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { FormContainer, Label, Title, InputField, StyledDivLinks, ErrorMessage, InputCheckbox, DivCheckbox } from "../components/forms";
import { Footer } from "src/components/footer";
import { TelaBase } from "src/components/telaBase";
import { Header } from "src/components/header";
import { MyButton } from "../components/myButton";

export function Cadastro() {
    const { register, watch, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate(); 

    const brTelefonePattern = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/;
    const senhaPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    const senha = watch("senha");

    const onSubmit = async (data) => {
        try {
            // CORREÇÃO: Rota ajustada para /pacientes/cadastro
            const response = await fetch('http://localhost:3001/pacientes/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    senha: data.senha
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Se der erro (ex: email duplicado), lança erro para o catch
                throw new Error(responseData.erro || "Erro ao cadastrar");
            }

            alert("Cadastro realizado com sucesso!");
            navigate("/login"); // Manda o usuário para a tela de login

        } catch (error) {
            // Tratamento de erros vindos do backend
            if (error.message && error.message.includes("Email já cadastrado")) {
                setError("email", { message: "Este e-mail já está em uso." });
            } else {
                alert("Ocorreu um erro: " + error.message);
            }
        }
    }

    return (
        <div className="login-container">
            <TelaBase>
                <Header />
                <Title>Cadastre-se</Title>
                <FormContainer onSubmit={handleSubmit(onSubmit)}>

                    <Label htmlFor="nome">Nome</Label>
                    <InputField {...register("nome", { required: "Nome é obrigatório" })} placeholder="Insira seu nome" /> 
                    {errors.nome && <ErrorMessage>{errors.nome.message}</ErrorMessage>}

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
                                message: "Telefone inválido. Formato: (XX) XXXXX-XXXX"
                            }
                        })} placeholder="Insira seu telefone" /> 
                    {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}

                    <Label htmlFor="senha">Senha</Label>
                    <InputField
                        id="senha"
                        type="password"
                        {...register("senha", {
                            required: "Senha é obrigatória",
                            pattern: {
                                value: senhaPattern,
                                message: "Senha inválida. \nDeve ter números, caractere especial e 6-16 dígitos."
                            }
                        })} placeholder="Insira sua senha" /> 
                    {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}

                    <Label htmlFor="confirmaSenha">Repita sua senha</Label>
                    <InputField
                        id="confirmaSenha"
                        type="password"
                        {...register("confirmaSenha", {
                            validate: value => value === senha || "As senhas não coincidem"
                        })} placeholder="Repita sua senha" /> 
                    {errors.confirmaSenha && <ErrorMessage>{errors.confirmaSenha.message}</ErrorMessage>}

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