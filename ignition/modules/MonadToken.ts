import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MonadTokenModule = buildModule("MonadTokenModule", (m) => {
  const token = m.contract("MonadToken", []);

  return { token };
});

export default MonadTokenModule;
