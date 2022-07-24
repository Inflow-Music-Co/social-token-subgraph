# social-token-subgraph
SocialTokenFactory contract address on Mainnet:

# TEMPORARY QUERY URL
https://api.studio.thegraph.com/query/27824/inflowmusic/0.3.7

# Query Example

Query holders of a specific token
```
{
    holders(where:{token:"0x343b81a96a178cecc492d5a942962ca032151a96"}){
        address
    }
}
```

Query multiple tokens
```
{
	tokenSearch(text:"0x03ea90039cdd4b3aed814c8faab35fd2f99d0b0d | 0x343b81a96a178cecc492d5a942962ca032151a96"){
        holders
        lastMintedUnitPrice
        averageSpend
        totalFees
    }
}
```