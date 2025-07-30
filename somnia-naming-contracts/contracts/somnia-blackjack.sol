// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SomniaBlackjack {
    address public owner;

    uint256 public constant MIN_BET = 0.1 ether;
    uint256 public constant MAX_BET = 5 ether;
    uint256 public constant MAX_CARDS = 10;
    uint256 public constant CHIP_REWARD = 100;
    uint256 public constant BLACKJACK_CHIP_BOOST = 120; // 20% more
    uint256 public constant MAX_DAILY_CHIPS = 1000;

    struct Game {
        uint8[] cards;
        uint8 sum;
        bool isAlive;
        bool hasBlackjack;
        uint256 betAmount;
        uint256 nonce; // For randomness
    }
    mapping(address => Game) public games;

    struct PlayerStats {
        uint256 wins;
        uint256 gamesPlayed;
        uint256 totalChips;
    }
    mapping(address => PlayerStats) public leaderboard;
    address[] public players;

    mapping(address => uint256) public chips;
    mapping(address => uint256) public chipsEarnedToday;
    mapping(address => uint256) public lastChipClaim;

    event GameStarted(address indexed player);
    event CardDrawn(address indexed player, uint8 card);
    event ChipsTransferred(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event ChipsSpent(address indexed player, uint256 amount);
    event RevenueWithdrawn(address indexed to, uint256 amount);
    event NFTMinted(address indexed player);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Since we don't use Pyth Entropy, fee is 0
    function getFee() external pure returns (uint128) {
        return 0;
    }

    // Generate random number using onchain sources
    function _generateRandomNumber(
        address player,
        uint256 nonce
    ) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        block.timestamp,
                        block.number,
                        player,
                        nonce
                    )
                )
            );
    }

    function startGame() external payable {
        Game storage game = games[msg.sender];
        require(!game.isAlive, "Game in progress");
        require(msg.value >= MIN_BET, "Insufficient bet");
        require(msg.value <= MAX_BET, "Bet too high");

        // Initialize game
        game.cards = new uint8[](0);
        game.sum = 0;
        game.isAlive = true;
        game.hasBlackjack = false;
        game.betAmount = msg.value;
        game.nonce++;

        // Generate two initial cards
        uint256 randomNumber = _generateRandomNumber(msg.sender, game.nonce);

        uint8 card1 = uint8((randomNumber % 13) + 1);
        uint8 card2 = uint8(((randomNumber / 100) % 13) + 1);

        // Convert to blackjack values
        card1 = card1 > 10 ? 10 : (card1 == 1 ? 11 : card1);
        card2 = card2 > 10 ? 10 : (card2 == 1 ? 11 : card2);

        game.cards.push(card1);
        game.cards.push(card2);
        game.sum = card1 + card2;

        leaderboard[msg.sender].gamesPlayed++;
        _trackPlayer(msg.sender);

        if (game.sum == 21) {
            game.hasBlackjack = true;
            _rewardPlayer(msg.sender, game.betAmount);
        } else {
            _grantDailyChips(msg.sender, CHIP_REWARD);
        }

        emit GameStarted(msg.sender);
    }

    function drawCard() external {
        Game storage game = games[msg.sender];
        require(game.isAlive, "No active game");
        require(!game.hasBlackjack, "Blackjack already");

        game.nonce++;
        uint256 randomNumber = _generateRandomNumber(msg.sender, game.nonce);

        uint8 card = uint8((randomNumber % 13) + 1);
        card = card > 10 ? 10 : (card == 1 ? 11 : card);

        game.cards.push(card);
        game.sum += card;

        if (game.sum == 21) {
            game.hasBlackjack = true;
            _rewardPlayer(msg.sender, game.betAmount);
            game.isAlive = false;
        } else if (game.sum > 21) {
            game.isAlive = false;
            _grantDailyChips(msg.sender, CHIP_REWARD);
        }

        emit CardDrawn(msg.sender, card);
    }

    function _rewardPlayer(address player, uint256 betAmount) internal {
        uint256 reward = betAmount + (betAmount / 10); // 10% bonus
        require(
            address(this).balance >= reward,
            "Insufficient contract balance"
        );
        payable(player).transfer(reward);
        leaderboard[player].wins++;
        _grantDailyChips(player, (CHIP_REWARD * BLACKJACK_CHIP_BOOST) / 100);
    }

    function _grantDailyChips(address player, uint256 amount) internal {
        if (block.timestamp > lastChipClaim[player] + 1 days) {
            chipsEarnedToday[player] = 0;
            lastChipClaim[player] = block.timestamp;
        }
        if (chipsEarnedToday[player] + amount > MAX_DAILY_CHIPS) {
            amount = MAX_DAILY_CHIPS - chipsEarnedToday[player];
        }
        chips[player] += amount;
        chipsEarnedToday[player] += amount;
        leaderboard[player].totalChips += amount;
    }

    function _trackPlayer(address player) internal {
        if (leaderboard[player].gamesPlayed == 1) {
            players.push(player);
        }
    }

    function resetGame() external {
        Game storage game = games[msg.sender];
        require(
            !game.isAlive || game.hasBlackjack || game.sum > 21,
            "Game still active"
        );
        delete games[msg.sender];
    }

    function transferChips(address to, uint256 amount) external {
        require(chips[msg.sender] >= amount, "Insufficient chips");
        chips[msg.sender] -= amount;
        chips[to] += amount;
        emit ChipsTransferred(msg.sender, to, amount);
    }

    function spendChips(uint256 amount) external {
        require(chips[msg.sender] >= amount, "Insufficient chips");
        chips[msg.sender] -= amount;
        emit ChipsSpent(msg.sender, amount);
    }

    function withdrawRevenue(address payable to) external onlyOwner {
        uint256 balance = address(this).balance;
        to.transfer(balance);
        emit RevenueWithdrawn(to, balance);
    }

    function mintNFT() external {
        require(chips[msg.sender] >= 10000, "Not enough chips for NFT");
        // TODO: Integrate NFT minting contract call here
        emit NFTMinted(msg.sender);
    }

    function getTopPlayers(
        uint256 limit
    ) external view returns (address[] memory top, uint256[] memory scores) {
        uint256 len = players.length < limit ? players.length : limit;
        top = new address[](len);
        scores = new uint256[](len);
        for (uint256 i = 0; i < players.length; i++) {
            address p = players[i];
            uint256 score = leaderboard[p].totalChips;
            for (uint256 j = 0; j < len; j++) {
                if (score > scores[j]) {
                    for (uint256 k = len - 1; k > j; k--) {
                        scores[k] = scores[k - 1];
                        top[k] = top[k - 1];
                    }
                    scores[j] = score;
                    top[j] = p;
                    break;
                }
            }
        }
    }

    function getGameState(
        address player
    ) external view returns (uint8[] memory, uint8, bool, bool, uint256) {
        Game storage game = games[player];
        return (
            game.cards,
            game.sum,
            game.isAlive,
            game.hasBlackjack,
            game.betAmount
        );
    }
}
