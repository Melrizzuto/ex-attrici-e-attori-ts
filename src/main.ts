type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string,
}

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"
};

function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === "object" && dati !== null &&
    "id" in dati && typeof dati.id === "number" &&
    "name" in dati && typeof dati.name === "string" &&
    "birth_year" in dati && typeof dati.birth_year === "number" &&
    "death_year" in dati &&
    (typeof dati.death_year === "undefined" || typeof dati.death_year === "number") &&
    "biography" in dati && typeof dati.biography === "string" &&
    "image" in dati && typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    typeof dati.most_famous_movies === "object" &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every(m => typeof m === "string") &&
    "awards" in dati && typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string" &&
    [
      "American",
      "British",
      "Australian",
      "Israeli-American",
      "South African",
      "French",
      "Indian",
      "Israeli",
      "Spanish",
      "South Korean",
      "Chinese"
    ].includes(dati.nationality)
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`)
    const dati: unknown = await response.json();
    if (!isActress(dati)) {
      throw new Error("Formato non valido")
    }
    return dati
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore nella ricezione dei dati")
    } else {
      console.error("Errore sconosciuto", error)
    }
  }
  return null
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses`)
    const dati: unknown = await response.json();
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    if (!(dati instanceof Array)) {
      throw new Error("Formato dati non valido")
    }
    const validActress: Actress[] = dati.filter(isActress)
    return validActress

  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore nella ricezione dei dati")
    } else {
      console.error("Errore sconosciuto", error)
    }
    return []
  }
}

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore nella ricezione dei dati");
    } else {
      console.error("Errore sconosciuto", error);
    }
    return [];
  }
}
