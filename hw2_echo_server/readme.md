**Task 1:**  
\- Write echo-server that prints the current time on the server in UTC format every N milliseconds
    and sends the response to client with a time when he/she was disconnected.

Run script:
```
node index.js   
    --intervalDelay=1000 (optional) - interval delay in Milliseconds 
    --closeConnectionAfterDelay=3000 (optional) - Сlose client connection after delay in N Ms
```

Example of complete command:  
`node index.js --intervalDelay=1000 --closeConnectionAfterDelay=5000`

**Task 2:**  
\- Rewrite homework #1 using `Promise` or `async/await`.  
(for running the script, please refer to the [`readme.md`](../hw1_group_files) in HW #1)

