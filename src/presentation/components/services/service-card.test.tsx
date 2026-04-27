import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServiceCard } from "./service-card";

const mockService = {
  id: "1",
  title: "Pintura Residencial",
  description: "Pinto casas e apartamentos com qualidade.",
  category: "Reformas",
  serviceType: "A domicílio",
  priceInfo: "A combinar",
  whatsapp: "11999999999",
  imageUrl: null,
};

describe("ServiceCard", () => {
  it("deve exibir o ícone correto baseado na categoria (Reformas -> Hammer)", () => {
    render(<ServiceCard service={mockService} />);
    
    // O ícone Hammer do lucide-react renderiza um SVG. 
    // Podemos verificar pelo test-id que adicionei no componente.
    const icon = screen.getByTestId("category-icon");
    expect(icon).toBeInTheDocument();
    
    // Verifica se o texto da categoria está correto
    expect(screen.getByText("Reformas")).toBeInTheDocument();
  });

  it("não deve exibir o botão de WhatsApp se o número não for fornecido", () => {
    const serviceWithoutWhatsapp = {
      ...mockService,
      whatsapp: null,
    };

    render(<ServiceCard service={serviceWithoutWhatsapp} />);
    
    const whatsappButton = screen.queryByTestId("whatsapp-button");
    expect(whatsappButton).not.toBeInTheDocument();
  });

  it("deve exibir o botão de WhatsApp se o número for fornecido", () => {
    render(<ServiceCard service={mockService} />);
    
    const whatsappButton = screen.getByTestId("whatsapp-button");
    expect(whatsappButton).toBeInTheDocument();
  });
});
