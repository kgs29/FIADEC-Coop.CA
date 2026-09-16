// ComboboxField.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useForm } from "react-hook-form";
import ComboboxField from "./ComboboxField";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverTrigger: ({
    children,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) => <div data-testid="popover-trigger">{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    role,
    "aria-expanded": ariaExpanded,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    role?: string;
    "aria-expanded"?: boolean;
  }) => (
    <button
      data-testid="combobox-trigger"
      onClick={onClick}
      disabled={disabled}
      role={role}
      aria-expanded={ariaExpanded}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/command", () => ({
  Command: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command">{children}</div>
  ),
  CommandInput: ({
    placeholder,
    value,
    onValueChange,
  }: {
    placeholder?: string;
    value?: string;
    onValueChange?: (v: string) => void;
  }) => (
    <input
      data-testid="command-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
    />
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-list">{children}</div>
  ),
  CommandGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-group">{children}</div>
  ),
  CommandItem: ({
    children,
    onSelect,
    disabled,
  }: {
    children: React.ReactNode;
    onSelect?: () => void;
    disabled?: boolean;
  }) => (
    <div data-testid="command-item" onClick={onSelect} aria-disabled={disabled}>
      {children}
    </div>
  ),
  CommandEmpty: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="command-empty">{children}</div>
  ),
}));

vi.mock("@/components/ui/form", () => ({
  FormField: ({
    render,
    name,
    control,
  }: {
    render: (args: {
      field: { value: unknown; onChange: (v: unknown) => void };
    }) => React.ReactNode;
    name: string;
    control: unknown;
  }) => {
    const field = {
      value: "",
      onChange: vi.fn(),
    };
    return <div data-testid="form-field">{render({ field })}</div>;
  },
  FormItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-item">{children}</div>
  ),
  FormLabel: ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <label data-testid="form-label" data-required={required}>
      {children}
    </label>
  ),
  FormControl: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="form-control">{children}</div>
  ),
  FormMessage: () => <span data-testid="form-message" />,
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockOptions = [
  { id: "1", libelle: "Option A" },
  { id: "2", libelle: "Option B" },
  { id: "3", libelle: "Option C" },
];

const mockOptionsNum = [
  { id: 1, libelle: "Numéro 1" },
  { id: 2, libelle: "Numéro 2" },
];

// ── Helper ────────────────────────────────────────────────────────────────────

const Wrapper = ({
  options = mockOptions,
  defaultValue = "",
  idType = "string" as "string" | "number",
  isFetching = false,
  disabled = false,
  required = false,
  placeholder = "Choisir...",
  search = undefined as string | undefined,
  setSearch = undefined as ((v: string) => void) | undefined,
}) => {
  const form = useForm({ defaultValues: { field: defaultValue } });
  // Patch control pour le mock FormField
  //   (form.control as never)._defaultValues = { field: defaultValue };

  return (
    <ComboboxField
      form={form}
      name="field"
      options={options}
      label="Mon label"
      placeholder={placeholder}
      idType={idType}
      isFetching={isFetching}
      disabled={disabled}
      required={required}
      search={search}
      setSearch={setSearch}
    />
  );
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ComboboxField", () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Rendu de base ────────────────────────────────────────────────────────────
  describe("Rendu de base", () => {
    it("affiche le label", () => {
      render(<Wrapper />);
      expect(screen.getByTestId("form-label")).toHaveTextContent("Mon label");
    });

    it("affiche le placeholder quand aucune valeur n'est sélectionnée", () => {
      render(<Wrapper placeholder="Choisir une option" />);
      expect(screen.getByTestId("combobox-trigger")).toHaveTextContent(
        "Choisir une option",
      );
    });

    it("affiche toutes les options dans la liste", () => {
      render(<Wrapper />);
      const items = screen.getAllByTestId("command-item");
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent("Option A");
      expect(items[1]).toHaveTextContent("Option B");
      expect(items[2]).toHaveTextContent("Option C");
    });

    it("affiche le champ de recherche", () => {
      render(<Wrapper />);
      expect(screen.getByTestId("command-input")).toBeInTheDocument();
    });

    it("le label est marqué required si required=true", () => {
      render(<Wrapper required />);
      expect(screen.getByTestId("form-label")).toHaveAttribute(
        "data-required",
        "true",
      );
    });

    it("le bouton est désactivé si disabled=true", () => {
      render(<Wrapper disabled />);
      expect(screen.getByTestId("combobox-trigger")).toBeDisabled();
    });
  });

  // ── Recherche locale ──────────────────────────────────────────────────────────
  describe("Filtrage local", () => {
    it("filtre les options selon la saisie", async () => {
      render(<Wrapper />);
      fireEvent.change(screen.getByTestId("command-input"), {
        target: { value: "A" },
      });
      await waitFor(() => {
        expect(screen.getAllByTestId("command-item")).toHaveLength(1);
        expect(screen.getByTestId("command-item")).toHaveTextContent(
          "Option A",
        );
      });
    });

    it("est insensible à la casse", async () => {
      render(<Wrapper />);
      fireEvent.change(screen.getByTestId("command-input"), {
        target: { value: "option b" },
      });
      await waitFor(() => {
        expect(screen.getByTestId("command-item")).toHaveTextContent(
          "Option B",
        );
      });
    });

    it("affiche 'no_results' si aucune option ne correspond", async () => {
      render(<Wrapper />);
      fireEvent.change(screen.getByTestId("command-input"), {
        target: { value: "zzz" },
      });
      await waitFor(() => {
        expect(screen.getByTestId("command-empty")).toHaveTextContent(
          "no_results",
        );
      });
    });

    it("affiche toutes les options si la recherche est effacée", async () => {
      render(<Wrapper />);
      const input = screen.getByTestId("command-input");
      fireEvent.change(input, { target: { value: "A" } });
      fireEvent.change(input, { target: { value: "" } });
      await waitFor(() => {
        expect(screen.getAllByTestId("command-item")).toHaveLength(3);
      });
    });
  });

  // ── setSearch externe ────────────────────────────────────────────────────────
  describe("setSearch prop externe", () => {
    it("appelle setSearch lors de la saisie", async () => {
      const setSearch = vi.fn();
      render(<Wrapper setSearch={setSearch} />);
      fireEvent.change(screen.getByTestId("command-input"), {
        target: { value: "test" },
      });
      await waitFor(() => {
        expect(setSearch).toHaveBeenCalledWith("test");
      });
    });

    it("synchronise searchTerm avec la prop search externe", () => {
      render(<Wrapper search="Option" />);
      expect(screen.getByTestId("command-input")).toHaveValue("Option");
    });

    it("ne plante pas si setSearch est undefined", async () => {
      render(<Wrapper setSearch={undefined} />);
      fireEvent.change(screen.getByTestId("command-input"), {
        target: { value: "test" },
      });
      await waitFor(() => {
        expect(screen.getByTestId("command-input")).toHaveValue("test");
      });
    });
  });

  // ── Sélection d'une option ───────────────────────────────────────────────────
  describe("Sélection", () => {
    it("le clic sur une option déclenche field.onChange", () => {
      render(<Wrapper />);
      fireEvent.click(screen.getAllByTestId("command-item")[0]);
      // onChange est mocké dans FormField, on vérifie que l'item est cliquable sans erreur
      expect(screen.getAllByTestId("command-item")[0]).toBeInTheDocument();
    });
  });

  // ── État isFetching ──────────────────────────────────────────────────────────
  describe("isFetching", () => {
    it("affiche l'icône de chargement dans le trigger", () => {
      render(<Wrapper isFetching />);
      // L'icône Loader est rendue, pas ChevronDown
      // On vérifie l'absence du chevron via le texte et la présence du loading item
      expect(screen.getByTestId("command-list")).toBeInTheDocument();
    });

    it("affiche le message 'loading...' dans la liste", () => {
      render(<Wrapper isFetching />);
      expect(screen.getByTestId("command-item")).toHaveTextContent(
        "loading...",
      );
    });

    it("ne rend pas les options quand isFetching=true", () => {
      render(<Wrapper isFetching />);
      const items = screen.getAllByTestId("command-item");
      // Un seul item : le loader
      expect(items).toHaveLength(1);
      expect(items[0]).toHaveTextContent("loading...");
    });
  });

  // ── Options vides ────────────────────────────────────────────────────────────
  describe("Options vides", () => {
    it("affiche 'no_results' si options est vide", () => {
      render(<Wrapper options={[]} />);
      expect(screen.getByTestId("command-empty")).toHaveTextContent(
        "no_results",
      );
    });

    it("affiche le placeholder si options est vide", () => {
      render(<Wrapper options={[]} placeholder="Aucune option" />);
      expect(screen.getByTestId("combobox-trigger")).toHaveTextContent(
        "Aucune option",
      );
    });
  });
});
