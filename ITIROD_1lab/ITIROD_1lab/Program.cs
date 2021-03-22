using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace ITIROD_1lab
{
    class Program
    {
        static string remoteAddress; 
        static int remotePort; 
        static int localPort; 
        static Thread receiveThread;
        static UdpClient receiver, sender;
        static string id;
        static User user;
        static string identification;
        static void Main(string[] args)
        {
            user = User.getInstance();
            Enter();
        }
        public static string NewID()
        {
            Guid guid = Guid.NewGuid();
            string id = guid.ToString();
            return id;
        }
        class User
        {
            private static User instance;
            public string id;
            public Dictionary<string,List<string>> chat = new Dictionary<string,List<string>>();
            private User()
            {
                id = NewID();
            }

            public static User getInstance()
            {
                if (instance == null)
                    instance = new User();
                return instance;
            }

            public void addToChat(string str)
            {
                List<string> temp = new List<string>();
                if(chat.TryGetValue(identification,out temp))
                {
                    chat[identification].Add(str);
                }
                    
            }

            public string chatToString()
            {
                string result = "";
                foreach (var item in chat[identification])
                {
                    result += item + "\n";
                }
                return result;
            }
        }
        private static void SendMessage()
        {
            sender = new UdpClient(); 
            try
            {
                while (true)
                {
                    string message = Console.ReadLine(); 
                    string message2 = user.id + ": "+ message; 
                   
                    byte[] data = Encoding.Unicode.GetBytes(message2);
                    sender.Send(data, data.Length, remoteAddress, remotePort); 
                    user.addToChat(message);
                    if (message.EndsWith("exit()"))
                    {
                        receiver.Close();
                        sender.Close();
                        Console.Clear();
                        receiveThread.Interrupt();
                        break;              
                    }
                }
            }
            catch (Exception ex)
            {
              
            }
            finally
            {
                sender.Close();
                Enter();
            }
        }
        private static void Enter()
        {
            while (true)
            {
                try
                {
                    Console.Write("Введите порт для прослушивания: "); // локальный порт
                    localPort = Int32.Parse(Console.ReadLine());
                    Console.Write("Введите удаленный адрес для подключения: ");
                    remoteAddress = Console.ReadLine(); // адрес, к которому мы подключаемся
                    Console.Write("Введите порт для подключения: ");
                    remotePort = Int32.Parse(Console.ReadLine()); // порт, к которому мы подключаемся

                    Thread receiveThread = new Thread(new ThreadStart(ReceiveMessage));
                    receiveThread.Start();
                    
                   
                    identification = "";
                    identification += localPort + "|" + remoteAddress + "|" + remotePort;
                    if (!user.chat.ContainsKey(identification))
                    {
                        user.chat.Add(identification, new List<string>());
                    }
                    Console.Clear();
                    if (user.chat.Count > 0)
                    {
                        Console.WriteLine(user.chatToString());
                    }
                    SendMessage();
                    break;
                }
                catch(Exception e)
                {
                    Console.WriteLine("Введите другие данные!!");
                }
            }
            
        }
        private static void ReceiveMessage()
        {
            receiver = new UdpClient(localPort);
            IPEndPoint remoteIp = null;
            try
            {
                
                while (true)
                {
                    byte[] data = receiver.Receive(ref remoteIp); 
                    string message = Encoding.Unicode.GetString(data);
                    if (message.EndsWith("exit()"))
                    {
                        Console.WriteLine(message.Substring(0,message.Length-8)+ " вышел");
                    }
                    else
                    {
                        Console.WriteLine(message);
                        user.addToChat(message);
                    }
                }
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            finally
            {
                receiver.Close();
            }
        }
    }
    }

