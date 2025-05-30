'use client';

import {
    useState,
    useEffect,
    useRouter,
    motion,
    Link,
    Input,
    Button,
    Label,
    Checkbox,
    Mail,
    Lock,
    EyeIcon,
    EyeOffIcon,
    handleError,
    showLoadingBar,
    RouteConst,
    useGetStore,
} from "@/helpers/exports/frontend/auth";
import isUserLoggedIn, {handleLoginSubmit} from "@/services/functions/auth";
import {useLogin} from "@/hooks/auth";




export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });

    const {
        trigger, isMutating, error
    } = useLogin();

    const {
        addUser,
    } = useGetStore();

    const isLoadingState =  isMutating;


    useEffect(() => {
        async function fetchData() {
                await isUserLoggedIn();
                router.replace(RouteConst.DASHBOARD);
        }

        fetchData();
    }, [router]);

    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setIsLoading(true);
        try {
            await handleLoginSubmit({ e, trigger, formState, addUser, router });
        } catch (error) {
            setIsLoading(false);
            handleError(error);
        }
    };

    if (error) handleError(error);

    // Remove the showLoadingBar() and handle loading state within the component

    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground"/>
                        Email
                    </Label>
                    <div className="relative group">
                        <Input
                            id="email"
                            type="email"
                            value={formState.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="h-12 pl-4 transition-all duration-300 border-input group-hover:border-primary/50 focus:border-primary"
                        />
                        <motion.span
                            className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                            initial={{width: 0}}
                            animate={{width: formState.email ? '100%' : 0}}
                            transition={{duration: 0.3}}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label
                            htmlFor="password"
                            className="text-base flex items-center gap-2"
                        >
                            <Lock className="h-4 w-4 text-muted-foreground"/>
                            Password
                        </Label>
                        <motion.div whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-primary hover:underline transition-all"
                            >
                                Forgot password?
                            </Link>
                        </motion.div>
                    </div>
                    <div className="relative group">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formState.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="h-12 pr-10 transition-all duration-300 border-input group-hover:border-primary/50 focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? (
                                <EyeOffIcon className="h-5 w-5"/>
                            ) : (
                                <EyeIcon className="h-5 w-5"/>
                            )}
                        </button>
                        <motion.span
                            className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-full"
                            initial={{width: 0}}
                            animate={{width: formState.password ? '100%' : 0}}
                            transition={{duration: 0.3}}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <Label htmlFor="remember" className="text-sm font-normal">
                        Remember me for 30 days
                    </Label>
                </div>

                <motion.div
                    whileHover={{scale: isLoadingState ? 1 : 1.01}}
                    whileTap={{scale: isLoadingState ? 1 : 0.99}}
                    transition={{type: 'spring', stiffness: 400, damping: 10}}
                >
                    <Button
                        type="submit"
                        className={`w-full h-12 text-base relative overflow-hidden group ${
                            isLoadingState ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        disabled={isLoadingState}
                    >
                        <span className="relative z-10">
                            {isLoadingState ? (
                                <motion.div
                                    animate={{rotate: 360}}
                                    transition={{
                                        duration: 1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: 'linear',
                                    }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                'Sign In'
                            )}
                        </span>
                        <span
                            className={`absolute inset-0 bg-gradient-to-r from-primary to-primary/80 z-0 ${
                                isLoadingState ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'
                            } transition-opacity duration-300`}
                        />
                    </Button>
                </motion.div>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <motion.span
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            className="inline-block"
                        >
                            <Link
                                href="/signup"
                                className="text-primary font-medium hover:underline transition-all"
                            >
                                Sign up
                            </Link>
                        </motion.span>
                    </p>
                </div>
            </form>
        </motion.div>
    );
}
