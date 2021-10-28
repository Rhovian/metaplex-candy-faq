#!/bin/sh
echo "Counting all assets..."
find assets -type f  | wc -l
echo "Counting all metadata files..."
find assets -type f -name '*.json' | wc -l
echo "Counting all image files..."
find assets -type f -name '*.png' | wc -l
echo "Skipping name check, this one must be done manually..."
echo "Checking Symbol values..."
find assets -type f -name '*.json' |  xargs jq -r '.symbol' | sort | uniq -c
echo "this command flattens, then counts the unique properties.creators values in your metadata."
echo "for most projects, you should see a consistent count across all parties (address-[1..3])"
find assets -type f -name '*.json' | xargs jq '.properties.creators' | jq -c '.[] | [.address,.share]' | sort | uniq -c
echo "this command extends the prior command by extracting the shares & summing them up."
echo "you should expect this to output 100..."
find assets -type f -name '*.json' | xargs jq '.properties.creators' | jq -c '.[] | [.address,.share]' | sort | uniq | jq '.[1]' | jq -s 'add'
echo "this command extracts unique seller_fee_basis_points, then sorts and counts them."
echo "for most projects you should see a consistent count across all metadata..."
find assets -type f -name '*.json' | xargs jq '.seller_fee_basis_points' | sort | uniq -c