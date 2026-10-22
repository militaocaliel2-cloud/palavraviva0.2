import { LegalPage } from "@/components/legal-page";

export default function TermsOfUseScreen() {
  return <LegalPage eyebrow="Uso responsável" title="Termos de Uso" updatedAt="22 de outubro de 2026" sections={[
    { title: "1. Aceitação", body: "Ao usar o Palavra Viva, você concorda com estes termos. Se não concordar, não utilize o app. Podemos atualizar o texto para refletir mudanças de funcionalidades ou exigências legais." },
    { title: "2. Finalidade do app", body: "O Palavra Viva oferece uma experiência de apoio à oração, à leitura da liturgia e à organização de uma rotina de fé. O conteúdo é informativo e devocional; ele não substitui a Bíblia, a orientação da Igreja, o acompanhamento pastoral ou qualquer aconselhamento profissional." },
    { title: "3. Conteúdo de terceiros", body: "As leituras diárias são obtidas de uma API pública. O app depende da disponibilidade e da correção desse serviço. Quando a API estiver indisponível, podemos exibir conteúdo de apoio ou uma mensagem de indisponibilidade." },
    { title: "4. Uso adequado", body: "Você deve usar o app de forma lícita e respeitosa. Não tente interromper a API, burlar controles de acesso, inserir código malicioso ou utilizar o serviço para prejudicar outras pessoas." },
    { title: "5. Compartilhamento e marcas", body: "Os textos preparados para WhatsApp e as imagens para Status/Stories são ferramentas de compartilhamento pessoal. Respeite direitos autorais, marcas e as regras das plataformas ao publicar o material." },
    { title: "6. Disponibilidade", body: "Podemos corrigir, alterar ou suspender partes do app para manutenção, segurança ou evolução do produto. Não garantimos que toda funcionalidade estará disponível em todos os dispositivos ou em todos os momentos." },
  ]} />;
}
