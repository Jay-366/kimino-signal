import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CharacterRegistryModule = buildModule("CharacterRegistryModule", (m) => {
  const characterRegistry = m.contract("CharacterRegistry", []);

  return { characterRegistry };
});

export default CharacterRegistryModule;
