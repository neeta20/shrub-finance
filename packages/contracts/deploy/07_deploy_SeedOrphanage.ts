import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  const seedDeployment = await deployments.get("PaperSeed")
  const seedAddress = seedDeployment.address;

  await deploy("SeedOrphanage", {
    from: deployer,
    args: [seedAddress],
    log: true,
  });
};
export default func;
func.id = "deploy_seed_orphanage"; // id to prevent re-execution
func.tags = ["SeedOrphanage"];
