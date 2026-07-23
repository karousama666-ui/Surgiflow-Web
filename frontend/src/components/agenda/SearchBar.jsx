import Input from "../ui/Input";

import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {

    return (

        <Input

            icon={Search}

            placeholder="Pesquisar paciente..."

            value={value}

            onChange={onChange}

        />

    )

}

export default SearchBar;