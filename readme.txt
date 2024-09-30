docker run -itd --cap-add=NET_ADMIN --cap-add=NET_RAW bot1
with auto start function:- docker run -itd --cap-add=NET_ADMIN --cap-add=NET_RAW --restart always bot1
with container name :- docker run -itd --name my_bot1 --cap-add=NET_ADMIN --cap-add=NET_RAW --restart always bot1

