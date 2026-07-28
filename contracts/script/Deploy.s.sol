// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Script.sol";
import "../src/PrivateSwapRouter.sol";

/**
 * Deploy PrivateSwapRouter on Ethereum Sepolia.
 *
 * Uniswap V2 Router02 on Sepolia (official):
 *   0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3
 *
 * Usage:
 *   forge script script/Deploy.s.sol:DeployPrivateSwap --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv
 */
contract DeployPrivateSwap is Script {
    address constant UNISWAP_V2_ROUTER_SEPOLIA = 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);

        PrivateSwapRouter router = new PrivateSwapRouter(UNISWAP_V2_ROUTER_SEPOLIA);

        console.log("PrivateSwapRouter deployed at:", address(router));
        console.log("Uniswap V2 Router:", UNISWAP_V2_ROUTER_SEPOLIA);
        console.log("WETH:", router.WETH());

        vm.stopBroadcast();
    }
}
