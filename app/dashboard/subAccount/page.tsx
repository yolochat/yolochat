"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/dashboard/datetime-picker";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export interface UserProfile {
  id: number;
  user_id: string;
  nickname: string;
  profile_created_at: string;
  age: number;
  birthday: string | null;
  height: number;
  sex: number;
  address: string | null;
  interests: Interest[] | null;
  bio: string;
  photos: (string | null)[];
  kyc: string | null;
  city: string;
  balance: number;
  is_vip: boolean;
  is_verified: boolean;
  administrator: string | null;
  focus: number;
  drink: number;
  character: number;
  figure: number;
  professions: string | null;
}

export interface Interest {
  cn: string;
  en: string;
  id: number;
  kor: string;
  created_at: string;
}

function TableDemo() {
  const [sub_account, setSub_account] = useState<UserProfile[]>([]);
  const [open, setOpen] = useState(false);

  const [nickname, setNickname] = useState<string>("");
  const [age, setAge] = useState<number>(0);
  const [birthday, setBirthday] = useState<Date>();
  const [height, setHeight] = useState<number>(0);
  const [sex, setSex] = useState<number>(0);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [bio, setBio] = useState<string>("");
  const [kyc, setKyc] = useState<string>("管理员账号");
  const [city, setCity] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [is_vip, setIs_vip] = useState<boolean>(false);
  const [is_verified, setIs_verified] = useState<boolean>(false);
  const [focus, setFocus] = useState<number>(0);
  const [drink, setDrink] = useState<number>(0);
  const [character, setCharacter] = useState<number>(0);
  const [figure, setFigure] = useState<number>(0);
  const [professions, setProfessions] = useState<string>("");

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<
    Array<string | ArrayBuffer | null>
  >([]);

  const supabase = createClient();

  async function fetchMyProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("administrator", user?.id);
    if (error) {
      console.error("Error fetching contacts:", error.message);
    } else {
      setSub_account(data);
    }
  }

  // 上传文件到supabase
  const handleFileChange = async (event: { target: { files: any } }) => {
    console.log("文件列表", event.target.files);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const files = event.target.files; // 获取选中的所有文件
    const filesArray: File[] = Array.from(files); // 将文件列表转为数组
    setPhotos(filesArray as File[]);

    filesArray.forEach((photo) => {
      supabase.storage
        .from("user")
        .upload(`${user?.id}_${uuidv4()}.png`, photo)
        .then(({ data, error }) => {
          if (error) {
            console.error("Error uploading file:", error);
          } else {
            const path = supabase.storage.from("user").getPublicUrl(data.path);
            console.log("图片路径：", path);
            if (path) {
              setPhotoPreviews((prevPhotos) => [
                ...prevPhotos,
                path.data.publicUrl,
              ]);
            }
          }
        });

      console.log("预览图片：：", photoPreviews);
    });

    console.log("作者是六", photoPreviews);
  };

  // 提交表单
  async function submitProfile() {
    if (
      !nickname ||
      !age ||
      !birthday ||
      !height ||

      !city ||
      !photos ||


      !professions ||
      !bio
    ) {
      alert("请填写完整信息");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("profile")
      .insert({
        nickName: nickname,
        age: age,
        birthday: birthday,
        height: height,
        sex: sex,
        bio: bio,
        photos: photoPreviews,
        kyc: kyc,
        city: city,
        balance: balance ?? 0,
        is_vip: is_vip,
        is_verified: is_verified,
        administrator: user?.id,
        focus: focus,
        drink: drink,
        character: character,
        figure: figure,
        profession: professions,
      })
      .select();

    console.log(data, error);

    setOpen(false);

    // console.log("昵称：", nickname);
    // console.log("年龄：", age);
    // console.log("生日：", birthday);
    // console.log("身高：", height);
    // console.log("性别：", sex);

    // console.log("bio：", bio);
    // console.log("kyc：", kyc);
    // console.log("城市：", city);
    // console.log("余额：", balance);
    // console.log("是否是会员：", is_vip);
    // console.log("是否是验证：", is_verified);
    // console.log("关注数量：", focus);
    // console.log("喝酒：", drink);
    // console.log("性格：", character);
    // console.log("身材：", figure);
    // console.log("工作：", professions);
    // console.log("照片：", photos);
  }

  useEffect(() => {
    fetchMyProfile();
  }, []);

  useEffect(() => {
    if (!open) {
      // Dialog 关闭时清除状态
      setNickname("");
      setAge(0);
      setBirthday(undefined);
      setHeight(0);
      setSex(0);
      setBio("");
      setKyc("管理员账号");
      setCity("");
      setBalance(0);
      setIs_vip(false);
      setIs_verified(false);
      setFocus(0);
      setDrink(0);
      setCharacter(0);
      setFigure(0);
      setProfessions("");
      setPhotos([]);
      setPhotoPreviews([]);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>添加子账号</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加子账号</DialogTitle>
            <DialogDescription>子账号自动继承您的管理员id</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                昵称
              </Label>
              <Input
                id="name"
                placeholder="不要写太长"
                className="col-span-3"
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                年龄
              </Label>
              <Input
                id="username"
                placeholder="填写一个整数"
                className="col-span-3"
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                生日
              </Label>
              {/* <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "w-[240px] justify-start text-left font-normal text-muted-foreground"
                    }
                  >
                    <CalendarIcon />
                    {birthday ? (
                      format(birthday, "PPP")
                    ) : (
                      <span>选择生日</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                  
                    mode="single"
                    selected={birthday}
                    onSelect={setBirthday}
                    initialFocus
                  />
                </PopoverContent>
              </Popover> */}

              <div className="col-span-3">
                <DateTimePicker value={birthday} onChange={setBirthday} />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                身高
              </Label>
              <Input
                id="username"
                placeholder="填写一个整数"
                className="col-span-3"
                onChange={(e) => setHeight(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                性别
              </Label>
              <Select
                onValueChange={(e) => {
                  setSex(Number(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={sex === 0 ? "女" : "男"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>默认女</SelectLabel>
                    <SelectItem value="0">女</SelectItem>
                    <SelectItem value="1">男</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                个性签名
              </Label>
              <Input
                id="username"
                placeholder="不要写太长"
                className="col-span-3"
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                城市
              </Label>
              <Input
                id="username"
                placeholder="必填，不能为空"
                className="col-span-3"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                余额
              </Label>
              <Input
                id="username"
                placeholder="选填：整数"
                className="col-span-3"
                onChange={(e) => setBalance(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                是否是会员
              </Label>
              <Select
                onValueChange={(e) => {
                  setIs_vip(JSON.parse(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={is_vip ? "是" : "否"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>默认为是</SelectLabel>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                KYC
              </Label>
              <Select
                onValueChange={(e) => {
                  setIs_verified(JSON.parse(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={is_verified ? "是" : "否"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>默认为是</SelectLabel>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                关注数量
              </Label>
              <Input
                id="username"
                placeholder="填写一个整数，不要大"
                className="col-span-3"
                onChange={(e) => setFocus(parseInt(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                身材
              </Label>
              <Select
                onValueChange={(e) => {
                  setFigure(Number(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      figure === 0 ? "苗条" : figure === 1 ? "一般" : "强壮"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="0">苗条</SelectItem>
                    <SelectItem value="1">一般</SelectItem>
                    <SelectItem value="2">强壮</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                性格
              </Label>
              <Select
                onValueChange={(e) => {
                  setCharacter(Number(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      figure === 0 ? "内向" : figure === 1 ? "温和" : "外向"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>默认为内向</SelectLabel>
                    <SelectItem value="0">内向</SelectItem>
                    <SelectItem value="1">温和</SelectItem>
                    <SelectItem value="2">外向</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                酒量
              </Label>
              <Select
                onValueChange={(e) => {
                  setDrink(Number(e));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      figure === 0 ? "不能喝" : figure === 1 ? "一般" : "能喝"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>默认为不能喝</SelectLabel>
                    <SelectItem value="0">不能喝</SelectItem>
                    <SelectItem value="1">一般</SelectItem>
                    <SelectItem value="2">能喝</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                工作
              </Label>
              <Input
                id="username"
                placeholder="提示"
                className="col-span-3"
                onChange={(e) => setProfessions(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              照片
            </Label>
            <Input
              type="file"
              accept="image/*"
              multiple
              id="username"
              placeholder="提示"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {photoPreviews.map((preview, index) => (
              <img
                key={index}
                src={photoPreviews[index] as string}
                alt={`Preview ${index + 1}`}
                style={{ width: "100px", height: "auto", margin: "5px" }}
              />
            ))}
          </div>

          <DialogFooter>
            <Button onClick={submitProfile}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>昵称</TableHead>
            <TableHead>年龄</TableHead>
            <TableHead>生日</TableHead>
            <TableHead>身高</TableHead>
            <TableHead>性别</TableHead>
            <TableHead>地址</TableHead>

            <TableHead>bio</TableHead>
            <TableHead>照片</TableHead>
            <TableHead>城市</TableHead>
            <TableHead>余额</TableHead>
            <TableHead>是否是会员</TableHead>
            <TableHead>管理员</TableHead>
            <TableHead>身材</TableHead>
            <TableHead>性格</TableHead>
            <TableHead>喝酒</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sub_account.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.nickname}</TableCell>
              <TableCell>{invoice.age}</TableCell>
              <TableCell>
                {new Date(invoice.birthday as string).toLocaleDateString(
                  "zh-CN",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </TableCell>
              <TableCell>{invoice.height}</TableCell>
              <TableCell>{invoice.sex === 0 ? "女" : "男"}</TableCell>
              <TableCell>{invoice.address}</TableCell>

              <TableCell>{invoice.bio}</TableCell>
              <TableCell>
                <img
                  src={invoice.photos[0] as string}
                  alt=""
                  height={100}
                  width={100}
                />
              </TableCell>
              <TableCell>{invoice.city}</TableCell>
              <TableCell>{invoice.balance}</TableCell>
              <TableCell>{invoice.is_vip ? "是" : "否"}</TableCell>
              <TableCell>{invoice.administrator}</TableCell>
              <TableCell>
                {invoice.figure === 0
                  ? "苗条"
                  : invoice.figure === 1
                  ? "适中"
                  : "强壮"}
              </TableCell>
              <TableCell>
                {invoice.character === 0
                  ? "内向"
                  : invoice.character === 1
                  ? "一般"
                  : "外向"}
              </TableCell>
              <TableCell>
                {invoice.drink === 0
                  ? "偶尔喝"
                  : invoice.character === 1
                  ? "不喝"
                  : "经常喝"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}

export default TableDemo;
